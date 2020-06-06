import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IProprietarioDTO } from 'src/app/shared/models/dtos/iproprietario-dto';
import { ProprietarioService } from '../proprietario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-proprietario-find-page',
  templateUrl: './proprietario-find-page.component.html',
  styleUrls: ['./proprietario-find-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProprietarioFindPageComponent implements OnInit, OnDestroy, AfterViewInit {

  disabledNew: boolean = true;
  disabledEdit: boolean = true;
  disabledDel: boolean = true;
  private theLocalUser: ILocalUser;
  private theInscricao: Subscription[] = new Array<Subscription>();
  dataSource: MatTableDataSource<IProprietarioDTO> = new MatTableDataSource();
  columnsToDisplay = ['id', 'matricula', 'nome', 'email'];
  expandedElement: IProprietarioDTO | null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private theActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private theProprietarioService: ProprietarioService,
    private theRouter: Router,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          this.disabledDel = true;
          this.disabledEdit = true;
          this.disabledNew = true;
          break;
        case 2:
          this.disabledDel = true;
          this.disabledEdit = true;
          this.disabledNew = true;
          break;
      }
    }
    this.theInscricao.push(this.theProprietarioService.findPage().subscribe(
      (x => {
        this.paginator.pageSizeOptions = [12, 24, 48, 100];
        this.paginator.length = x['totalElements'];
        this.paginator.showFirstLastButtons = true;
        this.paginator.pageSize = x['size'];
        this.paginator.pageIndex = x['number'];
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.dataSource = null;
    this.expandedElement = null;
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(theIProprietarioDTO: IProprietarioDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja realmente deletar esse registro??';
    instance.subTitle = 'Confirma a remoção?';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.theInscricao.push(this.theProprietarioService.delete(theIProprietarioDTO.id)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type == HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Deletando!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Proprietario foi Deletado com sucesso!';
              instance.urlNavigate = '/proprietarios';
              this.theRouter.navigate(['/']);
            }
          }, error => {

          }));
      }
    }));
  }

  update(theIProprietarioDTO: IProprietarioDTO) {
    this.theProprietarioService.setIProprietarioDTO(theIProprietarioDTO);
    this.theRouter.navigate(
      ['editar', theIProprietarioDTO.id],
      { relativeTo: this.theActivatedRoute }
    );
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.loadPage())
      ).subscribe());
  }

  loadPage() {
    this.theInscricao.push(this.theProprietarioService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'nome',
      'ASC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }
}
