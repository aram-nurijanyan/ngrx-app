import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {IndicatorModel} from '../../models/indicator.model';
import {ConfirmationPopupComponent} from '../confirmation-popup/confirmation-popup.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AngularFirestore} from '@angular/fire/firestore';
import {FrameworkLevelModel} from '../../models/framework-level.model';
import {IndicatorPopupComponent} from '../indicator-popup/indicator-popup.component';
import {Observable} from 'rxjs';

@Component({
  selector: "indicators-list",
  templateUrl: "./indicators-list.component.html",
  styleUrls: ["./indicators-list.component.scss"],
})
export class IndicatorsListComponent implements OnInit {
  @Input() getSelectedLevel$: Observable<string>;
  levelId: string;

  displayedColumns: string[] = [
    "name",
    "baseline",
    "actual",
    "target",
    "measurement",
    "actions"
  ];
  dataSource: MatTableDataSource<IndicatorModel>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog,
              private firestore: AngularFirestore) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSelectedLevel$.subscribe((id: string) => {
      this.levelId = id;
      id && this.firestore.collection('indicators', ref => ref.where('levelId', '==', id))
        .valueChanges({idField: 'id'}).subscribe((data: IndicatorModel[]) => {
          this.dataSource && (this.dataSource.data = data);
        })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openIndicatorPopup(indicator?: IndicatorModel) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: `${indicator ? "Edit" : "Add"} Indicator`,
        indicator,
        levelId: this.levelId,
      };
      dialogConfig.disableClose = true;
      dialogConfig.width = "600px";
      this.dialog
        .open(IndicatorPopupComponent, dialogConfig)
        .afterClosed()
        .subscribe((indicatorItem: IndicatorModel) => {
          if (indicatorItem) {
            if (indicator) {
              this.firestore
                .collection("indicators")
                .doc(indicator.id)
                .update(indicatorItem);
            } else {
              this.firestore.collection("indicators").add(indicatorItem);
            }
          }
        });
  }

  deleteIndicator(id: string) {
    this.dialog.open(ConfirmationPopupComponent)
      .afterClosed().subscribe((answer: boolean) => {
      if(answer) {
        this.firestore.collection("indicators").doc(id).delete();
      }
    })
  }
}
