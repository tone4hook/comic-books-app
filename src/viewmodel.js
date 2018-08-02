// knockout ViewModel Class
// import Weeks class
import Weeks from "./weeks";
// import ComicVine class
import ApiCall from "./apicall";
// import Locator; class
import Locator from "./locator";

class ViewModel {
	constructor() {
		let self = this;

		// < ----- NEW COMICS class variables ----- >
		//
		// DOM elements
		this._comicsWrapper = $("#new-comics-wrapper");
		this._comicsContainer = $("#comics-container");
		this._locatorWrapper = $("#locator-wrapper");
		this._paginationContainer = $(".pagination-container");
		this._loadingContainer = $("#loader-container");

		// Date variables
		// for handling weeks
		this._date = new Date();

		this._dateString = this._date.toISOString().substring(0, 10);

		this._weeks = new Weeks(this._dateString); // Weeks class instance

		this._weeks.setWeeks(); // Weeks setter

		this._releaseWeeks = this._weeks.getWeeks(); // Weeks getter

		this._currentWeek = ko.observable(this._releaseWeeks[0]); // current week

		// offset API parameter
		this._offset = ko.observable(0); // offset API parameter

		// Observable to filter display of comics info
		this._comicsFilter = ko.observable();

		// Observable Array for comics info API response
		this._comics = ko.observableArray();
		// page results
		this._pageResults = 20;
		this._totalPageResults = 0;
		// pages Observable Array
		this._pages = ko.observableArray();
		// current page
		this._currentPage = ko.observable(0);
		// boolean flag for API call
		this._flag = true;

		// Comic Vine API url with parameters
		this._comicVineApiKey = "YourComicVineApiKeyHere";
		// in string interpolation
		this._url = ko.pureComputed(() => {
			return (
				`http://www.comicvine.com/api/` +
				`issues/` +
				`?api_key=${this._comicVineApiKey}` +
				`&field_list=image,description,id,issue_number,store_date,volume` +
				`&filter=store_date:${this._currentWeek().start}|${
					this._currentWeek().end
				}` +
				`&offset=${this._offset()}&limit=20&sort=store_date:desc&format=jsonp&json_callback=jsonCallback`
			);
		}, this);

		// filter the current display of comics
		// based on the text input value
		this._filterComics = this.filterComicVine(
			this._comicsFilter,
			this._comics
		); // /_filterComics

		// set container visibility
		this._comicsContainer.css({ visibility: "visible" });

		// < ----- STORE LOCATOR class variables ----- >
		this._locator = new Locator();

		this._location = ko.observable();

		this._stores = ko.observableArray();

		this._storesFilter = ko.observable();

		this._filterStores = this.filterYelp(this._storesFilter, this._stores); // /_filterStores

		// API calls
		this.callComicVine();

		this.callYelp();
	} // /constructor

	filterComicVine(obs, obsArr) {
		// filter the current display of comics
		// based on the text input value
		let filtered = ko.computed(() => {
			let filter = obs();
			let arr = [];
			if (filter) {
				ko.utils.arrayForEach(obsArr(), item => {
					if (
						item.volume.name
							.toUpperCase()
							.indexOf(filter.toUpperCase()) > -1
					) {
						arr.push(item);
					} // /if
				});
			} else {
				arr = obsArr();
			} // /if else

			return arr;
		}, this); // /_filtered

		return filtered;
	} // /filterComicVine

	filterYelp(obs, obsArr) {
		// filter the current display of comics
		// based on the text input value
		let filtered = ko.computed(() => {
			let filter = obs();
			let arr = [];
			if (filter) {
				ko.utils.arrayForEach(obsArr(), item => {
					if (
						item.name.toUpperCase().indexOf(filter.toUpperCase()) >
						-1
					) {
						arr.push(item);
					} // /if
				});
			} else {
				arr = obsArr();
			} // /if else

			return arr;
		}, this); // /_filtered

		return filtered;
	} // /filterYelp

	callComicVine() {
		let self = this;

		// initialize ApiCall clas
		this._apiCall = new ApiCall(this._url());
		// get ajax response Object
		this._repsonse = this._apiCall.getResponse();
		// handle reponse
		this._repsonse
			.done(data => {
				self.setComics(data);
			})
			.fail(xhr => {
				console.log("error", xhr);
				alert(
					"Sorry, something went wrong.\nPlease refresh and try again."
				);
			}); // /handle reponse
	} // /callComicVine

	callYelp(response = { lat: 40.650002, lng: -73.949997 }) {
		let self = this;

		let yelp = this._apiCall.post(response);

		yelp.done(data => {
			self._stores(data.businesses);

			self.setMarkers();
		}).fail(xhr => {
			console.log("error", xhr);
		}); // /yelp handle response
	} // /callYelp

	// <--- BUTTON EVENT HANDLERS -->
	// New Comics and Store Locator toggle handler
	optionClicked(item, event) {
		if (!$(event.target).hasClass("active")) {
			$(".option-btn").toggleClass("active"); // toggle active class

			this.slide([this._comicsWrapper, this._locatorWrapper]);
		} // /if
	} // option button click handler

	toggleSidebar() {
		this._locatorWrapper.toggleClass("toggled");
	} // toggle the sidebar list
	// <--- /BUTTON EVENT HANDLERS -->

	// add response to Observable Array
	setComics(data) {
		// if call is first from given date
		// set new paginination
		if (this._flag) {
			this.pageHandler(data);
			this.slide([this._paginationContainer, this._loadingContainer]);
		} else {
			this.slide([this._loadingContainer]);
		} // /if

		// add to Observable Array
		this._comics(data.results);

		// add CSS to response html
		this.addCss();
	} // /setComics

	// get the selected week option from select element
	// call API and update new comics based on selected week
	weekSelected() {
		let self = this;

		// flag prevents updating pagination
		// on page button click
		// while calling API
		this._flag = true;

		this._comics([]);

		this.slide([this._paginationContainer, this._loadingContainer]);

		this._weeks = new Weeks(this._currentWeek().start);

		this._weeks.setWeeks(); // Weeks setter

		this._releaseWeeks = this._weeks.getWeeks(); // Weeks getter

		this._offset = ko.observable(0); // offset API parameter

		// set container visibility
		this._comicsContainer.css({ visibility: "visible" });

		this.callComicVine();
	} // /weekSelected

	// set number of pages
	// update _pages Observable Array
	pageHandler(data) {
		// page results
		this._pageResults = data.number_of_page_results;
		this._totalPageResults = data.number_of_total_results;

		let isActive = true;

		if (this._totalPageResults > this._pageResults) {
			let pagesNum = Math.ceil(
				this._totalPageResults / this._pageResults
			);

			let arr = [];

			for (let i = 0; i < pagesNum; i++) {
				arr.push({
					page: i + 1,
					offset: i * 20,
					active: isActive ? "active" : ""
				});

				isActive = false;
			}

			this._pages(arr);
		}
	} // /pageHandler

	// pagination event handler
	pagination(el, item) {
		let self = this;

		// flag prevents updating pagination
		// on page button click
		// while calling API
		self._flag = false;

		// check if current active page
		if (!$(el).hasClass("active")) {
			self._comics([]);

			self.slide([this._loadingContainer]);

			self._offset(item.offset);

			this.callComicVine();

			// remove .active class from <li>
			$(".pagination")
				.find(".active")
				.removeClass("active");
			// add .active class to <li>
			$(el).addClass("active");
		} // /if
	} // /pagination

	// add CSS to API response html
	addCss() {
		// add Bootstrap .table class
		// to table elements from API response
		$(".description")
			.find("table")
			.addClass("table table-responsive");
	} // /addCss

	slide(elements) {
		for (let el of elements) {
			el.slideToggle();
		} // /for
	} // /slide

	// open comic book modal
	openModal(el, data) {
		let id = "#" + $(el).data("id");
		$(id).modal();
	} // openModal

	// changeLocation
	changeLocation() {
		let self = this;

		let coordResponse = this._locator.getCoordinates(this._location());

		coordResponse
			.then(response => {
				self.callYelp(response);
			})
			.catch(error => {
				console.log(error);
			});
	} // /changeLocation

	// resetMarkers
	setMarkers() {
		this._locator.addMarkers(this._filterStores());
	} // /resetMarkers

	// open infowindow on list button click
	openWindow(el, item) {
		let self = this;

		for (let [index, marker] of this._filterStores().entries()) {
			if (item.name == marker.name) {
				self._locator.markerClicked(index, null);

				break;
			}
		}
	} // /openWindow
} // /ViewModel

ko.applyBindings(new ViewModel()); // apply bindings to element
