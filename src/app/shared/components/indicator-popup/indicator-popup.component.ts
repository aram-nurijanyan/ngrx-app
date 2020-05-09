import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Component({
  selector: "app-indicator-popup",
  templateUrl: "./indicator-popup.component.html",
  styleUrls: ["./indicator-popup.component.scss"]
})
export class IndicatorPopupComponent implements OnInit {
  title: string = "";
  levelId: string;

  indicatorForm: FormGroup;
  measurements$: Observable<Measurement[]>;


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<IndicatorPopupComponent>,
    private fb: FormBuilder,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.measurements$ = this.firestore.collection<Measurement>('measurements').valueChanges();
    this.indicatorForm = this.fb.group({
      name: [this.data.indicator ? this.data.indicator.name : '', Validators.required],
      baseline: [this.data.indicator ? this.data.indicator.baseline : ''],
      actual: [this.data.indicator ? this.data.indicator.actual : ''],
      target: [this.data.indicator ? this.data.indicator.target : ''],
      measurement: [this.data.indicator ? this.data.indicator.measurement : 'quantity']
    });
    this.title = this.data.title;
    this.levelId = this.data.levelId;
  }

  confirm() {
    if(this.indicatorForm.valid) {
      const progress = +this.indicatorForm.get('actual').value*100/+this.indicatorForm.get('target').value || 0;
      this.dialogRef.close({
        ...this.indicatorForm.value,
        progress,
        levelId: this.levelId
      });
    }
  }
}

export interface Measurement {
  id: string,
  name: string
}
