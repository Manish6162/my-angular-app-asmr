import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { FeedsComponent } from './feeds/feeds.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ReelsComponent } from './reels/reels.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { HeaderhComponent } from './headerh/headerh.component';
import { CreatePopupComponent } from './create-popup/create-popup.component'; 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FeedsComponent,
    HomeComponent,
    SearchComponent,
    ReelsComponent,
    MessagesComponent,
    NotificationsComponent,
    ProfileComponent,
    HeaderhComponent,
    CreatePopupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    AppRoutingModule
  ],
  providers: [UserService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
