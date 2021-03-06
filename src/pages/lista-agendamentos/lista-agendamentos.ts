import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AgendamentoDaoProvider } from '../../providers/agendamento-dao/agendamento-dao';
import { Agendamento } from '../home/modelos/agendamento';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';

@IonicPage()
@Component({
  selector: 'page-lista-agendamentos',
  templateUrl: 'lista-agendamentos.html',
})
export class ListaAgendamentosPage {
  agendamentos: Agendamento[];
  private _alerta;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _agendamentoDao: AgendamentoDaoProvider,
    private _alertContrl: AlertController,
    private _agendamentosService: AgendamentosServiceProvider) {
  }

  ionViewDidLoad() {
    this._agendamentoDao.listaTodos()
      .subscribe(
        (agendamentos: Agendamento[]) => {
          this.agendamentos = agendamentos;
        }
      )
  }

  reenvia(agendamento: Agendamento) {

    this._alerta = this._alertContrl.create({
      title: 'Aviso',
      buttons: [
        {
          text: 'ok'
        }
      ]
    });

    let mensagem = ''; // recebe a mensagem de sucesso ou de erro

    return this._agendamentosService.agenda(agendamento)
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
        () => mensagem = 'Agendamento reenviado',
        (err: Error) => mensagem = err.message
      );
  }

  excluiAgendamento(agendamento: Agendamento) {
   //
  }


}
