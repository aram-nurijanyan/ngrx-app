import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FrameworkLevelModel } from "./shared/models/framework-level.model";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ShowMessagePopupComponent } from "./shared/components/show-message-popup/show-message-popup.component";
import { FrameworkLevelPopupComponent } from "./shared/components/framework-level-popup/framework-level-popup.component";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { getTree } from "./shared/utils/tree.util";

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
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  private _transformer = (node: FrameworkLevelModel, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      item: node,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore
      .collection<FrameworkLevelModel>("frameworkLevels")
      .valueChanges({ idField: "id" })
      .subscribe((data: FrameworkLevelModel[]) => {
        this.dataSource.data = getTree(data);
      });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  showDescription(frameworkLevel: FrameworkLevelModel) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: frameworkLevel.description,
      title: "Description",
    };
    this.dialog.open(ShowMessagePopupComponent, dialogConfig);
  }

  openFrameworkLevel(
    frameworkLevel?: FrameworkLevelModel,
    addChild: boolean = false
  ) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: `${frameworkLevel ? "Edit" : "Add"} Framework Level`,
      frameworkLevel: addChild ? null : frameworkLevel,
      parentId: addChild ? frameworkLevel.id : null,
      level: addChild ? frameworkLevel.level : null,
    };
    dialogConfig.disableClose = true;
    dialogConfig.width = "600px";
    this.dialog
      .open(FrameworkLevelPopupComponent, dialogConfig)
      .afterClosed()
      .subscribe((level: FrameworkLevelModel) => {
        if (level) {
          if (frameworkLevel && !addChild) {
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

  deleteFrameworkLevel(id: string) {
    this.firestore.collection("frameworkLevels").doc(id).delete();
  }
}
