import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppMatElevationDirective } from "./shared/directives/app-mat-elevation.directive";
import { ShowMessagePopupComponent } from "./shared/components/show-message-popup/show-message-popup.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FrameworkLevelPopupComponent } from "./shared/components/framework-level-popup/framework-level-popup.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {MatSidenavModule} from "@angular/material/sidenav";
import { IndicatorsListComponent } from './shared/components/indicators-list/indicators-list.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { ConfirmationPopupComponent } from './shared/components/confirmation-popup/confirmation-popup.component';
import {MatSortModule} from "@angular/material/sort";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { IndicatorPopupComponent } from './shared/components/indicator-popup/indicator-popup.component';
import { NumbersOnlyDirective } from './shared/directives/numbers-only.directive';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    AppMatElevationDirective,
    ShowMessagePopupComponent,
    FrameworkLevelPopupComponent,
    IndicatorsListComponent,
    ConfirmationPopupComponent,
    IndicatorPopupComponent,
    NumbersOnlyDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
