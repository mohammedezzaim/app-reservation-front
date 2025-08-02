import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Appartement} from "../../model/appartemetModel/appartement.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppartemetService {


  imagesUtilisateur:any;
  public codeAppartemetService! :string;

  public  editAppartemetExiste : Appartement=new Appartement();


  public _item: Appartement = new Appartement();
  public _items:Array<Appartement>=new Array<Appartement>();



  constructor(private http: HttpClient) {

  }

  public save(appadtemetFormData: FormData): Observable<any> {
    return this.http.post<number>("https://safarent-backend.up.railway.app/api/appartement/", appadtemetFormData);
  }

  public getAll():Observable<Array<Appartement>>{
    return this.http.get<Array<Appartement>>("https://safarent-backend.up.railway.app/api/appartement/public");
  }
  public  getByCategoriesAppartementLibelleAndPropAppartementUsername(libelle:String,username:String):Observable<Array<Appartement>>{
    return this.http.get<Array<Appartement>>(`https://safarent-backend.up.railway.app/api/appartement/CategorieAppartementLibelle/${libelle}/PropAppartementUsername/${username}`);
  }

  public delete(code:String):Observable<any>{
    return this.http.delete<number>(`https://safarent-backend.up.railway.app/api/appartement/code/${code}`);
  }


  public  getAppartemetsbyLibelle(libelle:String):Observable<any>{
    return this.http.get(`https://safarent-backend.up.railway.app/api/appartement/listAppartementCategories/${libelle}`);
  }


  public  getAppartemetsCin(cin:number):Observable<any>{
    return this.http.get(`https://safarent-backend.up.railway.app/api/appartement/listAppartementCin/${cin}`);
  }


  public  update(propritaire:Appartement):Observable<any>{
    return this.http.put("https://safarent-backend.up.railway.app/api/appartement/",propritaire)

  }

  // public getImagesByProduitRef(code:string):any{
  //
  //   this.http.get(`https://safarent-backend.up.railway.app/api/appartement/images/${code}`).subscribe(
  //     {
  //       next:data=>{
  //         this.imagesUtilisateur=data
  //         console.log(this.imagesUtilisateur);
  //       },
  //       error:err => {
  //         console.log(err);
  //       }
  //     }
  //   );
  //
  // }


  public getImagesByProduitRef(code:string):Observable<any>{
    return  this.http.get<any>(`https://safarent-backend.up.railway.app/api/appartement/images/${code}`);

  }


  public  deleteImageCloudinary(url:string){
    this.http.delete(`https://safarent-backend.up.railway.app/api/appartement/images/cloudinary/${url}`)
  }


  get items(): Array<Appartement> {
    return this._items;
  }

  set items(value: Array<Appartement>) {
    this._items = value;
  }

  get item(): Appartement {
    return this._item;
  }

  set item(value: Appartement) {
    this._item = value;
  }


  get(code: string):Observable<Appartement> {
    return this.http.get<Appartement>(`https://safarent-backend.up.railway.app/api/appartement/public/code/${code}`);
  }


  getImages(code: string):Observable<any> {
    return this.http.get<any>(`https://safarent-backend.up.railway.app/api/appartement/code/${code}`);
  }
}
