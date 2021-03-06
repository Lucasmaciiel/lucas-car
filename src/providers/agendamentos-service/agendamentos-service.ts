import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Agendamento } from '../../pages/home/modelos/agendamento';

@Injectable()
export class AgendamentosServiceProvider {

  private _url = 'http://10.11.21.68:8080/api';

  constructor(private _http: HttpClient) {

  }

  agenda(agendamento: Agendamento) {
    return this._http
      .post(this._url + '/agendamento/agenda', agendamento)
      .do(() => agendamento.enviado = true)
      .catch((err) => Observable.of(new Error('Falha no agendamento! Tente novamente mais tarde')));
  }

}
