import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListaAgendamentosPage } from '../pages/lista-agendamentos/lista-agendamentos';
import { PerfilPage } from '../pages/perfil/perfil';
import { UsuariosServiceProvider } from '../providers/usuarios-service/usuarios-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'myapp',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) public nav: Nav;
  rootPage: any = 'LoginPage';

  public paginas = [
    { titulo: 'Agendamentos', componente: ListaAgendamentosPage.name, icone: 'calendar' },
    { titulo: 'Perfil', componente: PerfilPage.name, icone: 'person' }
  ];


  constructor(public translate: TranslateService,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _usuariosService: UsuariosServiceProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
         
      //translate.addLangs(["en-US", "pt-BR"]); 
      //translate.use('en-US');
      translate.setDefaultLang('pt-BR');
      let browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/pt-BR|en-US/) ? browserLang : 'en-US');

    });
  }

  irParaPagina(componente) {
    this.nav.push(componente);
  }

  get avatar() {
    return this._usuariosService.obtemAvatar();
  }
  get usuarioLogado() {
    return this._usuariosService.obtemUsuarioLogado();
  }






}

