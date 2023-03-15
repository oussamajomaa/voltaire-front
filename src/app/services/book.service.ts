import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BookService {
	
	constructor(
		private http: HttpClient
	) { }

	


	addBook(book){
		return this.http.post(`${environment.url}/add-book`,book)	
	}

	getBooks(){
		return this.http.get(`${environment.url}/show-book`)	
	}

	deleteBook(id){
		return this.http.delete(`${environment.url}/deleteBook`,{params:{id:id}})
	}

	getOneBook(id){
		return this.http.get(`${environment.url}/get-one-book`,{params:{id:id}})
	}

	updateBook(book){
		return this.http.patch(`${environment.url}/edit-book`,book)
	}

	addContributor(contributor){
		return this.http.post(`${environment.url}/add-contributor`,contributor)	
	}

	getContributors(){
		return this.http.get(`${environment.url}/show-contributor`)	
	}

	deleteContributor(id){
		return this.http.delete(`${environment.url}/delete-contributor`,{params:{id:id}})
	}

	addBookContributor(item){
		return this.http.post(`${environment.url}/add-book-contibutor`,item)	
	}

	getBookContributor(id){
		return this.http.get(`${environment.url}/book-contributor`,{params:{id:id}})
	}

	updateContributor(contributor){
		return this.http.patch(`${environment.url}/edit-contributor`,contributor)	
	}

	searchContributor(first_name){
		return this.http.get(`${environment.url}/search-contributor`,{params:{first_name:first_name}})
	}

	searchBook(title){
		return this.http.get(`${environment.url}/search-book`,{params:{title:title}})
	}

	searchSource(source){
		return this.http.get(`${environment.url}/search-source`,{params:{source:source}})
	}

	searchNotes(notes){
		return this.http.get(`${environment.url}/search-notes`,{params:{notes:notes}})
	}

	addClassification(item){
		return this.http.post(`${environment.url}/add-classification`,item)
	}

	getAllClassification(){
		return this.http.get(`${environment.url}/get-allClassification`)
	}

	getClassification(id){
		return this.http.get(`${environment.url}/get-classification`,{params:{id:id}})
	}

	getChartContributor() {
		return this.http.get(`${environment.url}/chart-contributor`)
	}

	getChartBC() {
		return this.http.get(`${environment.url}/chart-book-contributor`)
	}

	getChartBooks(){
		return this.http.get(`${environment.url}/chart-book`)
	}

	

	getChartClassification(){
		return this.http.get(`${environment.url}/chart-classification`)
	}

	// Cette methode va regrouper la liste selon le nom du fichier
	groupBy(list:any, keyGetter:any) {
		const map = new Map();
		list.forEach((item:any) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}

	// Sort list of elements
	sortList(list:[]) {
		list.sort((a: any, b: any) => {
			if (a > b) return 1
			if (a < b) return -1
			return 0
		})
	}
	
	
}
