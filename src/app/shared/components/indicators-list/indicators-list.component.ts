import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {IndicatorModel} from "../../models/indicator.model";
import {ConfirmationPopupComponent} from "../confirmation-popup/confirmation-popup.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/firestore";
import {IndicatorPopupComponent} from "../indicator-popup/indicator-popup.component";
import {Observable} from "rxjs";
import {DecimalPipe} from "@angular/common";

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

  decimalPipe = new DecimalPipe(navigator.language);

  ngOnInit() {
    this.changePaginatorLabels();
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

  changePaginatorLabels() {
    this.paginator._intl.itemsPerPageLabel = 'Քանակը ըստ էջի';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} ընդհանուր ${this.decimalPipe.transform(length)}-ից`;
    };
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
        title: `${indicator ? "Խմբագրել" : "ԱՎելացնել"} Ինդիկատոր`,
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
