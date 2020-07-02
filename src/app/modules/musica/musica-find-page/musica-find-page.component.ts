import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { IMusicaDTO } from 'src/app/shared/models/dtos/imusica-dto';
import { MusicaService } from '../musica.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { DialogOverviewAudioComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-audio/dialog-overview-audio.component';
import { AlbumService } from '../../album/album.service';

@Component({
  selector: 'app-musica-find-page',
  templateUrl: './musica-find-page.component.html',
  styleUrls: ['./musica-find-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MusicaFindPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private delete: boolean;
  private insert: boolean;
  private readonly linear: boolean = true;
  private theAlbumForm: FormGroup;  
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theLocalUser: ILocalUser;
  private update: boolean;

  dataSource: MatTableDataSource<IMusicaDTO> = new MatTableDataSource();
  columnsToDisplay = ['faixa', 'nome', 'autor', 'duracao'];
  expandedElement: IMusicaDTO | null;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private theAlbumService: AlbumService,
    private theFormBuilder: FormBuilder,    
    private theMusicaService: MusicaService,
    private theRouter: Router,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          this.delete = true;
          this.insert = true;
          this.update = true;
          break;
        case 2:
          this.delete = true;
          this.insert = true;
          this.update = true;
          break;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDelete(): boolean {
    return this.delete;
  }

  getInsert(): boolean {
    return this.insert;
  }

  getLinear(): boolean {
    return this.linear;
  }

  getTheAlbumForm(): FormGroup {
    return this.theAlbumForm;
  }

  getUpdate(): boolean {
    return this.update;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.theAlbumService.eventEmitter.subscribe(
      theIAlbum => {
        this.getTheAlbumForm().patchValue({
          theIAlbum: theIAlbum.id
        });
        this.theInscricao.push(this.theMusicaService.findPage(
          0,
          12,
          'faixa',
          'ASC',
          theIAlbum.id).subscribe(
            (x => {
              this.paginator.pageSizeOptions = [12, 24, 48, 100];
              this.paginator.length = x['totalElements'];
              this.paginator.showFirstLastButtons = true;
              this.paginator.pageSize = x['size'];
              this.paginator.pageIndex = x['number'];
              this.paginator.pageIndex = x['number'];
              this.dataSource = new MatTableDataSource(x['content']);
            })
          )
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    ));
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
  }

  ngOnDestroy() {
    this.dataSource = null;
    this.expandedElement = null;
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.theAlbumForm = this.theFormBuilder.group({
      theIAlbum: ['', [Validators.required]]
    });
  }

  onDelete(theIMusicaDTO: IMusicaDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja realmente deletar esse registro??';
    instance.subTitle = 'Confirma a remoção?';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.theInscricao.push(this.theMusicaService.delete(theIMusicaDTO.id)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type == HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Deletando!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Música foi Deletada com sucesso!';
              instance.urlNavigate = '/musicas';
              this.theRouter.navigate(['/']);
            }
          }, error => {

          }));
      }
    }));
  }

  onLoadPage() {
    this.theInscricao.push(this.theMusicaService.findPage(
      0,
      12,
      'faixa',
      'ASC',
      this.getTheAlbumForm().get('theIAlbum').value).subscribe(
        (x => {
          this.dataSource = new MatTableDataSource(x['content']);
        })
      )
    );
  } 

  onUpdate(theIMusicaDTO: IMusicaDTO) {
    this.theMusicaService.setIMusicaDTO(theIMusicaDTO);
    this.theRouter.navigate(
      ['musicas/editar', theIMusicaDTO.id]
    );
  }

  openDialogAudio(theIMusicaDTO: IMusicaDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewAudioComponent, {});
    let instance = dialogRef.componentInstance;
    instance.title = theIMusicaDTO.nome;
    instance.subtitle = theIMusicaDTO.autor;
    instance.url = theIMusicaDTO.arquivoUrl;
  }
}
