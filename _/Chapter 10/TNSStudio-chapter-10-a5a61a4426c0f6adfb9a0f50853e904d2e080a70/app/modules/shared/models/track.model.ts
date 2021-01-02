import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ITrack {
  id?: number;
  filepath?: string;
  name?: string;
  order?: number;
  volume?: number;
  mute?: boolean;
  model?: any;
}
export class TrackModel implements ITrack {
  public id: number;
  public filepath: string;
  public name: string;
  public order: number;
  public model: any;

  public volume$: BehaviorSubject<number>;
  
  private _volume: number = 1; // set default to full volume
  private _mute: boolean;
  private _origVolume: number; // value to return to after unmute

  constructor(model?: ITrack) {
    this.volume$ = new BehaviorSubject(this._volume);

    if (model) {
      for (let key in model) {
        this[key] = model[key];
      }
    }
    // use assign a random id
    if (!this.id) this.id = Math.floor(Math.random() * 10000000);
  }

  public set mute(value: boolean) {
    value = typeof value === 'undefined' ? false : value;
    console.log('setting mute from TrackModel:', value);
    this._mute = value;
    if (this._mute) {
      this._origVolume = this._volume;
      this.volume = 0;
    } else {
      this.volume = this._origVolume;
    }
  }

  public get mute() {
    return this._mute;
  }

  public set volume(value: number) {
    value = typeof value === 'undefined' ? 1 : value;
    console.log('setting volume from TrackModel:', value);
    this._volume = value;
    this.volume$.next(this._volume);
    if (this._volume > 0 && this._mute) {
      // if just increasing volume from a muted state
      // ensure it's unmuted 
      this._origVolume = this._volume;
      this._mute = false;
    }
  }

  public get volume() {
    return this._volume;
  }


}