import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IMusicaDTO } from 'src/app/shared/models/dtos/imusica-dto';
import { MusicaService } from '../musica.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';

@Component({
  selector: 'app-musica-dialog-overview',
  templateUrl: './musica-dialog-overview.component.html',
  styleUrls: ['./musica-dialog-overview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MusicaDialogOverviewComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() album_id: number;
  @Input() album_nome: string;
  @Input() album_capa: string;
  private theInscricao: Subscription[] = new Array<Subscription>();

  dataSource: MatTableDataSource<IMusicaDTO> = new MatTableDataSource();
  columnsToDisplay = ['faixa', 'nome', 'duracao'];
  expandedElement: IMusicaDTO | null;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<MusicaDialogOverviewComponent>,
    private theMusicaService: MusicaService,
    private theUnsubscribeControl: UnsubscribeControlService) { }

  ngAfterViewInit() {
    this.theInscricao.push(this.theMusicaService.findPage(
      0,
      12,
      'faixa',
      'ASC',
      this.album_id).subscribe(
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
  }

  onLoadPage() {
    this.theInscricao.push(this.theMusicaService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'faixa',
      'ASC',
      this.album_id
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }
}
