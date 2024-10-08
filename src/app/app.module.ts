import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { ViewsModule } from "./views/views.module";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularTokenModule } from "angular-token";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LayoutContainersModule } from "./containers/layout/layout.containers.module";
import { XhrInterceptor } from "./http.interceptor";
import { OpenAIApi } from "openai";

@NgModule({
  imports: [
    BrowserModule,
    ViewsModule,
    AppRoutingModule,
    LayoutContainersModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    AngularTokenModule.forRoot({
      apiBase: "https://api.mediasecho.com",
    //  apiBase: "http://localhost:3000",
      apiPath: "api/v1",

      signInPath: "auth/sign_in",
      signInRedirect: null,
      signInStoredUrlStorageKey: null,

      signOutPath: "auth/sign_out",
      validateTokenPath: "auth/validate_token",
      signOutFailedValidate: false,

      registerAccountPath: "auth",
      deleteAccountPath: "auth",
      registerAccountCallback: window.location.href,

      updatePasswordPath: "auth",
      resetPasswordPath: "auth/password",
      resetPasswordCallback: window.location.href,
      loginField: "email",
      oAuthBase: window.location.origin,
      oAuthPaths: {
        github: "auth/github",
      },
      oAuthCallbackPath: "oauth_callback",
      oAuthWindowType: "newWindow",
      oAuthWindowOptions: null,
    }),
  ],
  declarations: [AppComponent],
  providers: [
    AngularTokenModule,
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
    OpenAIApi
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
