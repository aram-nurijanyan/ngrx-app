import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { IndicatorModel } from "../../models/indicator.model";
import {ConfirmationPopupComponent} from "../confirmation-popup/confirmation-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: "indicators-list",
  templateUrl: "./indicators-list.component.html",
  styleUrls: ["./indicators-list.component.scss"],
})
export class IndicatorsListComponent implements OnInit {
  @Input('indicators')
  set indicators(value: IndicatorModel[]) {
    this.dataSource && (this.dataSource.data = value);
  }

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
    this.dataSource = new MatTableDataSource(this.indicators);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openIndicatorPopup(indicator: IndicatorModel) {

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
