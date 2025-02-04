import { Component, OnInit, ViewChild } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { FrameworkLevelModel } from "./shared/models/framework-level.model";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FrameworkLevelPopupComponent } from "./shared/components/framework-level-popup/framework-level-popup.component";
import { AngularFirestore } from "@angular/fire/firestore";
import { getProgress, getTree } from "./shared/utils/tree.util";
import { IndicatorModel } from "./shared/models/indicator.model";
import { MatDrawer } from "@angular/material/sidenav";
import { ConfirmationPopupComponent } from "./shared/components/confirmation-popup/confirmation-popup.component";
import { Subject } from "rxjs";

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  item: FrameworkLevelModel;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  selectedLevel: Subject<string> = new Subject<string>();

  private _transformer = (node: FrameworkLevelModel, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      item: node
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  constructor(private dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore
      .collection<FrameworkLevelModel>("frameworkLevels")
      .valueChanges({ idField: "id" })
      .subscribe(levels => {
        this.firestore
          .collection<IndicatorModel>("indicators")
          .valueChanges({ idField: "id" })
          .subscribe(indicators => {
            this.dataSource.data = getTree(levels, indicators);
          });
      });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  openFrameworkLevel(
    event: Event,
    frameworkLevel?: FrameworkLevelModel,
    addChild: boolean = false
  ) {
    event.stopPropagation();
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      frameworkLevel: addChild ? null : frameworkLevel,
      parentId: addChild ? frameworkLevel.id : null,
      level: addChild ? frameworkLevel.level + 1 : 0,
      viewMode: frameworkLevel && !addChild
    };
    dialogConfig.disableClose = true;
    dialogConfig.width = "600px";
    this.dialog
      .open(FrameworkLevelPopupComponent, dialogConfig)
      .afterClosed()
      .subscribe((level: FrameworkLevelModel) => {
        if (level) {
          if (frameworkLevel && !addChild) {
            delete level.children;
            delete level.indicators;
            this.firestore
              .collection("frameworkLevels")
              .doc(frameworkLevel.id)
              .update(level);
          } else {
            this.firestore.collection("frameworkLevels").add(level);
          }
        }
      });
  }

  deleteFrameworkLevel(event: Event, frameworkLevel: FrameworkLevelModel) {
    event.stopPropagation();
    this.dialog
      .open(ConfirmationPopupComponent)
      .afterClosed()
      .subscribe((answer: boolean) => {
        if (answer) {
          const batch = this.firestore.firestore.batch();
          this.deleteLevel(frameworkLevel, batch);
          batch.commit();
        }
      });
  }

  openIndicators(id: string) {
    this.selectedLevel.next(id);
    this.drawer.toggle();
  }

  canAddChild(frameworkLevel: FrameworkLevelModel): boolean {
    if (frameworkLevel.indicators && frameworkLevel.indicators.length) {
      return false;
    } else {
      return frameworkLevel.level !== 2;
    }
  }

  getProgress(frameworkLevel: FrameworkLevelModel): number {
    return getProgress(frameworkLevel);
  }

  deleteLevel(frameworkLevel: FrameworkLevelModel, batch: any) {
    batch.delete(
      this.firestore.firestore
        .collection("frameworkLevels")
        .doc(frameworkLevel.id)
    );
    frameworkLevel.indicators.forEach((indicator: IndicatorModel) => {
      batch.delete(
        this.firestore.firestore.collection("indicators").doc(indicator.id)
      );
    });
    frameworkLevel.children.forEach((child: FrameworkLevelModel) => {
      this.deleteLevel(child, batch);
    });
  }
}
