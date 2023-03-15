import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class OptionChartService {

	constructor() { }

	pie: any
	bar: any
	line: any
	polarRadial: any
	polarBar: any
	radar: any
	scatter: any
	funnel: any
	timeLine: any
	sunburst: any
	area: any

	

	optionBar(data1: any, data2: any, name: string,text:string) {
		this.bar = {

			title:{
				text:text,
				left: 'center'
			},
			toolbox: {
				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					// backgroundColor: '#222',
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			xAxis: {
				type: 'category',
				data: data1,
				axisLabel: {
					inside: true,
					color: '#000',
					rotate: 90,
				},
				z: 10,
			},
			yAxis: {},
			tooltip: {},
			dataZoom: {
				start: 0,
				type: "inside"
			},
			series: [
				{
					name: name,
					data: data2,
					type: 'bar',
					itemStyle: {
						color: '#83bff6',
					},
				},
			],
		}
		return this.bar
	}

	optionLine(data1: any, data2: any, name: string,text:string) {
		this.line = {
			title:{
				text:text,
				left: 'center'
			},
			xAxis: {
				type: 'category',
				data: data1,
				axisLabel: {
					// inside: true,
					color: '#000',
					rotate: 90,
				},
			},
			grid: {
				bottom: 0,
				containLabel: true
			},
			yAxis: {},
			tooltip: {},

			toolbox: {
				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			dataZoom: {
				start: 0,
				type: "inside"
			},
			series: [
				{
					name: name,
					data: data2,
					type: 'line',
					smooth: true
				},
			],
		}
		return this.line
	}

	

	// 

	optionArea(data1: any, data2: any, name: string,text:string) {
		this.area = {
			title:{
				text:text,
				left: 'center'
			},
			xAxis: {
				type: 'category',
				data: data1,
				axisLabel: {
					// inside: true,
					color: '#000',
					rotate: 270,
				},
			},
			grid: {
				bottom: 0,
				containLabel: true
			},
			yAxis: {
				type: 'value'
			},
			tooltip: {},

			toolbox: {

				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					// backgroundColor: '#222',
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			dataZoom: {
				start: 0,
				type: "inside"
			},
			series: [
				{
					name: name,
					data: data2,
					type: 'line',
					areaStyle: {},
					// smooth: true
				},
			],
		}
		return this.area
	}

	optionPie(dataObject, name: string,text:string) {
		this.pie = {
			title:{
				text:text,
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				type:'scroll',
				orient: "horizontal",
				bottom:'bottom'
			},
			toolbox: {
				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			xAxis: {
				axisLine: {
					show: false,
				},
			},
			yAxis: {
				axisLine: {
					show: false,
				},
			},
			dataZoom: {
				start: 0,
				type: "inside"
			},
			series: [
				{
					name: name,
					data: dataObject,
					type: 'pie',
				},
			],
		}
		return this.pie
	}

	optionPolarRadial(data: any, name: string,text:string) {
		this.polarRadial = {
			title:{
				text:text,
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				type:'scroll',
				orient: "horizontal",
				bottom:'bottom'
			},
			toolbox: {
				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			calculable: true,

			dataZoom: {
				start: 0,
				type: "inside"
			},
			series: [
				{
					name: name,
					data: data,
					radius: [25, 150],
					center: ['50%', '50%'],
					type: 'pie',
					roseType: 'area',
				},
			],

			animation: true
		}
		return this.polarRadial
	}

	optionFunnel(data1: any, data2: any, data: any, name: string,text:string) {
		this.funnel = {
			title:{
				text:text,
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				type:'scroll',
				orient: "horizontal",
				bottom:'bottom'
			},
			toolbox: {
				feature: {
					saveAsImage: { title: "" }
				},
				tooltip: { // same as option.tooltip
					show: true,
					formatter: function () {
						return '<div>' + 'download as png' + '</div>'; // user-defined DOM structure
					},
					textStyle: {
						fontSize: 12,
					},
					extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
				},
			},
			series: [
				{
					name: name,
					type: 'funnel',
					left: '10%',
					width: '80%',
					data: data
				},
			]
		}
		return this.funnel
	}

}