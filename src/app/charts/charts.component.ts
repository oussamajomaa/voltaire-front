import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { OptionChartService } from '../services/option-chart.service';
import { EChartsOption } from 'echarts';
import { Options } from '@angular-slider/ngx-slider';
import * as jquery from 'jquery';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements AfterViewInit {

	@ViewChild('sidenav') sidenav: ElementRef;
	@ViewChild('content') content: ElementRef;
	@ViewChild('menu') menu: ElementRef;
	@ViewChild('close') close: ElementRef;

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		if (this.screenWidth <= 960){
			this.sidenav.nativeElement.style.left="-250px"
			this.content.nativeElement.style.marginLeft="0"
			// this.menu.nativeElement.style.display="block"
		}
		else{
			this.sidenav.nativeElement.style.left="0"
			this.content.nativeElement.style.marginLeft="250px"
			// this.menu.nativeElement.style.display="none"
		}
		this.onCloseMenu()
	  }
  
	
	sliderValue: any = 40;
	highValue: any = 60;
	sliderOptions: Options = {
		floor: 0,
		ceil: 100
	};

	contributors: any = []
	books: any = []
	books_places: any = []
	books_dates: any = []
	classification: any = []
	options: any
	optionPie: EChartsOption = {};
	optionBar: EChartsOption = {};
	optionPolarBar: EChartsOption = {};
	optionLine: EChartsOption = {};
	optionRadar: EChartsOption = {};
	optionPolarRadialBar: EChartsOption = {};
	optionScatter: EChartsOption = {};
	optionFunnel: EChartsOption = {};
	optionTimeLine: EChartsOption = {};
	optionSunburst: EChartsOption = {};
	optionArea: EChartsOption = {};

	bc: any = []
	key: any
	title: string
	titleFilter: string
	text:string
	data: any = []
	data1: any = []
	data2: any = []
	newData1: any = []
	newData2: any = []
	response: any = []
	dataObject: any = []
	newDataObject: any = []
	params: string
	dates = []
	typeChart: string

	selectedItem: any = []
	sliderValues: any = []

	screenWidth: any;
	screenHeight: any;

	constructor(private bookService:BookService, private optionChart: OptionChartService) { 
		// this.onResize()
	}

	ngAfterViewInit(): void {
		this.bookService.getChartBC().subscribe((res: any) => {
			res.map(item => {
				item.full_name = (item.first_name + " " +item.last_name).trim()
				return item
			})
			this.bc = res
			
		})
		this.bookService.getChartClassification().subscribe((res: any) => this.classification = res)
		// this.bookService.getChartContributor().subscribe((res: any) => {
		// 	res.map(item => {
		// 		item.full_name = (item.first_name + " " +item.last_name).trim()
		// 		return item
		// 	})
		// 	this.contributors = res
			
		// })
		this.bookService.getChartBooks().subscribe((res: any) => {
			// this.books_dates = res.filter(book => {
			// 	return book.publication_date != null
			// })
			this.books = res
			
			let data = this.bookService.groupBy(res, item => item.publication_date)
			
			
			
			for (let key of data) {
				if (key[0] != null){
					this.dates.push({ name: parseInt(key[0]) })
					this.dates.sort((a, b) => {
						if (a.name > b.name) return 1
						if (a.name < b.name) return -1
						return 0
					})
				}
			}
		})

		// select2
		jquery('.js-example-basic-single').select2({
			width: '100%',
			placeholder: this.title
		});
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
		// if (this.screenWidth <= 800){
		// 	this.sidenav.nativeElement.style.left="-250px"
		// 	this.content.nativeElement.style.marginLeft="0"
		// 	this.close.nativeElement.style.display="none"
		// }
		// else{
		// 	this.sidenav.nativeElement.style.left="0"
		// 	this.content.nativeElement.style.marginLeft="250px"
		// 	this.close.nativeElement.style.display="none"
		// }		
	}

	
	onClickMenu(){
		this.sidenav.nativeElement.style.left="0"
		this.content.nativeElement.style.marginLeft="250px"
		// this.close.nativeElement.style.display="block"
	}

	onCloseMenu(){
		if (this.screenWidth <= 800){
			this.sidenav.nativeElement.style.left="-250px"
			this.content.nativeElement.style.marginLeft="0"
			// this.close.nativeElement.style.display="none"
		}
	}

	executeFilter() {
		this.selectedItem = jquery('.js-example-basic-single').val()

		this.newDataObject = []
		this.selectedItem.map(name => {
			let object = this.dataObject.filter(item => {
				if (item.name === name)
					return item
			})
			this.newDataObject.push(object[0])
		})

		this.data1 = []
		this.data2 = []
		this.newDataObject.forEach(item => {
			this.data1.push(item.name)
			this.data2.push(item.value)
		})

		this.displayCharts(this.data1, this.data2, this.newDataObject)
	}


	onButtonClick(params) {		
		this.dataObject = []
		this.data1 = []
		this.data2 = []
		this.sliderValue = this.dates[0].name;
		
		this.highValue = this.dates[this.dates.length - 1].name;
		this.sliderOptions = {
			floor: this.dates[0].name,
			ceil: this.dates[this.dates.length - 1].name
		};
		
		this.sliderValues = [this.dates[0].name, this.dates[this.dates.length - 1].name]
		this.params = params

		this.getDataParams(this.params, this.data, this.data1, this.data2, this.dataObject, this.bc, this.books, this.classification)
		this.bookService.sortList(this.data1)

		if (this.params === '') {
			this.newDataObject = []
			this.dataObject = []
			this.data1 = []
			this.data2 = []
			this.title = ''
			this.typeChart = ""
		}

		this.displayCharts(this.data1, this.data2, this.dataObject)
		// if (this.typeChart) this.onCloseMenu()
	}


	// filtrer selon une période
	onChangeDate() {
		this.newDataObject = []
		this.dataObject = []
		this.data1 = []
		this.data2 = []
		this.title = ''


		let newBooks = []
		this.books.filter(book => {
			if (parseInt(book.publication_date) >= this.sliderValues[0] &&
				parseInt(book.publication_date) < this.sliderValues[1])
				newBooks.push(book)
		})

		let newBc = []
		this.bc.filter(book => {
			if (parseInt(book.publication_date) >= this.sliderValues[0] &&
				parseInt(book.publication_date) < this.sliderValues[1])
				newBc.push(book)
		})

		let newClassification = []
		this.classification.filter(book => {
			if (parseInt(book.publication_date) >= this.sliderValues[0] &&
				parseInt(book.publication_date) < this.sliderValues[1])
				newClassification.push(book)
		})

		this.getDataParams(this.params, this.data, this.data1, this.data2, this.dataObject, newBc, newBooks, newClassification)
		this.bookService.sortList(this.data1)

		this.displayCharts(this.data1, this.data2, this.dataObject)

	}

	getDataParams(params: string, data: any, data1: any[], data2: any[], dataObject: any[], tableBC: any[], books: any[], tableClassification: any[]) {
		if (params === 'status') {
			data = this.bookService.groupBy(tableBC, item => item.status)
			this.title = 'Chart of books according to the contributor role'
			this.titleFilter = 'Select a role'
			this.text = 'Contributor role'
		}
		if (params === 'full_name') {
			data = this.bookService.groupBy(tableBC, item => item.full_name)
			this.title = 'Chart of books according to the contributor name'
			this.titleFilter = 'Select a contributor'
			this.text = 'Contributor name'
		}
		if (params === 'publication_date') {
			data = this.bookService.groupBy(books, item => item.publication_date)
			this.title = 'Chart of books according to the publication date'
			this.titleFilter = 'Select a publication date'
			this.text = 'Date of publication'
		}
		if (params === 'publication_place') {
			data = this.bookService.groupBy(books, item => item.publication_place)
			this.title = 'Chart of books according to the publication place'
			this.titleFilter = 'Select a publication place'
			this.text = 'Place of publication'
		}
		if (params === 'classification') {
			data = this.bookService.groupBy(tableClassification, item => item.description)
			this.title = 'Chart of books according to the book classification'
			this.titleFilter = 'Select a classification'
			this.text = 'Book classification'
		}
		
		for (let key of data) {
			if (key[0] != null)
				dataObject.push({ value: key[1].length, name: key[0].substr(0, 30) })
		}


		dataObject.sort((a, b) => {
			if (a.name > b.name) return 1
			if (a.name < b.name) return -1
			return 0
		})

		dataObject.forEach(item => {
			data1.push(item.name)
			data2.push(item.value)
		})
	}

	displayCharts(data1, data2, dataObject) {
		if (this.params != 'status'){
			this.optionPie = this.optionChart.optionPie(dataObject,'books', this.text)
			this.optionPolarRadialBar = this.optionChart.optionPolarRadial(dataObject,'books', this.text)
			this.optionBar = this.optionChart.optionBar(data1, data2,'books', this.text)
			this.optionLine = this.optionChart.optionLine(data1, data2,'books', this.text)
			this.optionArea = this.optionChart.optionArea(data1, data2,'books', this.text)
			this.optionFunnel = this.optionChart.optionFunnel(data1, data2, dataObject,'books', this.text)
		}
		else{
			this.optionPie = this.optionChart.optionPie(dataObject,'contributors', this.text)
			this.optionPolarRadialBar = this.optionChart.optionPolarRadial(dataObject,'contributors', this.text)
			this.optionBar = this.optionChart.optionBar(data1, data2,'contributors', this.text)
			this.optionLine = this.optionChart.optionLine(data1, data2,'contributors', this.text)
			this.optionArea = this.optionChart.optionArea(data1, data2,'contributors', this.text)
			this.optionFunnel = this.optionChart.optionFunnel(data1, data2, dataObject,'contributors', this.text)
		}
	}

	selectType(event){
		this.typeChart = event
		this.onCloseMenu()
	}


}