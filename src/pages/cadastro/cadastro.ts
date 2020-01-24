import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { Carro } from '../home/modelos/carro';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';
import { HomePage } from '../home/home';
import { Agendamento } from '../home/modelos/agendamento';
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs/Observable';


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
    private _storage: Storage) {

    this.carro = this.navParams.get('carroSelecionado');
    this.precoTotal = this.navParams.get('precoTotal');

  }

  agenda() {
    if (!this.nome || !this.endereco || !this.email) {
      this._alertContrl.create({
        title: 'Preenchimento obrigatório',
        subTitle: 'Preencha todos os campos',
        buttons: [
          { text: 'Ok' }
        ]
      }).present();

      return;
    }

    /*  console.log(this.nome);
      console.log(this.endereco);
      console.log(this.email);
      console.log(this.data); */

    let agendamento: Agendamento = {
      nomeCliente: this.nome,
      enderecoCliente: this.endereco,
      emailCliente: this.email,
      modeloCarro: this.carro.nome,
      precoTotal: this.precoTotal,
      confirmado: false,
      enviado: false
    };

    this._alerta = this._alertContrl.create({
      title: 'Aviso',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });

    let mensagem = ''; // recebe a mensagem de sucesso ou de erro

    this._agendamentosService.agenda(agendamento)
      .mergeMap((valor) => { 

        let observable = this.salvar(agendamento);
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

  salvar(agendamento) {
    let chave = this.email + this.data.substr(0, 10);
    let promise = this._storage.set(chave, agendamento);

    return Observable.fromPromise(promise);
  }

}