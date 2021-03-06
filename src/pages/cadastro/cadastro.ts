import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { Carro } from '../home/modelos/carro';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';
import { Agendamento } from '../home/modelos/agendamento';
import { AgendamentoDaoProvider } from '../../providers/agendamento-dao/agendamento-dao';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  public carro: Carro;
  public precoTotal: number;
  public nome: string = '';
  public endereco: string = '';
  public email: string = '';
  public data: string = new Date().toISOString();

  private _alerta: Alert;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertContrl: AlertController,
    private _agendamentosService: AgendamentosServiceProvider,
    private _agendamentoDao: AgendamentoDaoProvider,
    private _vibration: Vibration,
    private _datePicker: DatePicker
  ) {
    this.carro = this.navParams.get('carroSelecionado');
    this.precoTotal = this.navParams.get('precoTotal');
  }
  selecionaData() {
    this._datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this._datePicker.ANDROID_THEMES.THEME_TRADITIONAL
    }).then(data => this.data = data.toISOString());
  }
  /* selecionaData() {
     this._datePicker.show({
         date: new Date(),
         mode: 'date'
     })
     .then( data => this.data = data.toISOString() );
 } */
  agenda() {
    if (!this.nome || !this.endereco || !this.email) {
      this._vibration.vibrate(500);
      this._alertContrl.create({
        title: 'Preenchimento obrigatório',
        subTitle: 'Preencha todos os campos',
        buttons: [
          { text: 'Ok' }
        ]
      }).present();

      return;
    }
    let agendamento: Agendamento = {
      nomeCliente: this.nome,
      enderecoCliente: this.endereco,
      emailCliente: this.email,
      modeloCarro: this.carro.nome,
      precoTotal: this.precoTotal,
      confirmado: false,
      enviado: false,
      data: this.data
    };

    this._alerta = this._alertContrl.create({
      title: 'Aviso',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            this.navCtrl.setRoot('HomePage');
          }
        }
      ]
    });

    let mensagem = ''; // recebe a mensagem de sucesso ou de erro

    this._agendamentoDao.ehDuplicado(agendamento)
      .mergeMap(ehDuplicado => {
        if (ehDuplicado) {
          throw new Error('Agendamento existente!');
        }
        return this._agendamentosService.agenda(agendamento);
      })
      .mergeMap((valor) => {

        let observable = this._agendamentoDao.salvar(agendamento);
        if (valor instanceof Error) {
          throw valor;
        }
        return observable;

      })
      .finally(() => {
        this._alerta.setSubTitle(mensagem);
        this._alerta.present();
      }
      )
      .subscribe(
        () => mensagem = 'Agendamento realizado com sucesso!',
        (err: Error) => mensagem = err.message
      );
  }




}
