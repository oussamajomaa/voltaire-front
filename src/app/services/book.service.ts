import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class BookService {

	constructor(
		private http: HttpClient
	) { }

	addBook(book){
		return this.http.post(`${environment.url_book}/add-book`,book)
		
	}

	getBooks(){
		return this.http.get(`${environment.url_book}/show-book`)	
	}

	deleteBook(id){
		return this.http.delete(`${environment.url}/deleteBook`,{params:{id:id}})
	}
}
