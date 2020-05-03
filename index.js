// GLOBAL VARIABLES
let selectedEventObj;

const selectedEventObjReset = {
  seatGeekApiKey: 'MTY3NTIzOTB8MTU1ODY0MzMzOS41Mw',
  googleApiKey: 'AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc',
  origLocation: '',
  origLocationCoors: {
    lat: '',
    long: '',
  },
  eventSearchDate: '',
  eventSearchRange: '',
  eventSelected: false,
  eventName: '',
  eventTime: '',
  eventAddress: '',
  eventID: '',
  eventDetailsLink: '',
  eventCoors: {
    lat: '',
    long: '',
  },
  eventVenue: '',
  eventType: '',
  eventLocation: '',
  eventCost: '',
  restaurantSelected: false,
  restaurantName: '',
  restaurantAddress: '',
  restaurantLocation: '',
  restaurantPhone: '',
  restaurantRatings: '',
  restaurantCost: '',
  restaurantCoors: {
    lat: '',
    long: '',
  },
  restaurantIMG: '',
  restaurantIMG2: '',
  restaurantMenu: '',
  restaurantDetails: '',
  restaurantFoodType: '',
  showMenu: false,
  historyCounter: 0,
  history: [mainPageGenerator(), entertainmentPageGenerator(), foodAndDrinksPageGenerator()],
  zomatoSearchQuery: '',
  costSlide: false,
  eventSlide: false,
  restaurantSlide: false,
  showHighLights: false,
};

// FUNCTIONS: START
function start() {
  // RESET selectedEventObj AND APPEND FIRST PAGE
  selectedEventObj = selectedEventObjReset;
  appendPage(selectedEventObj.history[selectedEventObj.historyCounter]);
}

// FUNCTIONS: BACK-BTN-DISABLER
function backBtnDisabler() {
  if (selectedEventObj.historyCounter < 2) {
    $('.back').hide();
  } else {
    $('.back').show();
  }
}

// FUNCTIONS: FORWARD-BTN-DISABLER
function forwardBtnDisable() {
  if (selectedEventObj.historyCounter >= 1 || selectedEventObj.historyCounter === 0) {
    $('.forward').hide();
  } else {
    $('.forward').show();
  }
}

// FUNCTIONS: DATE-SETTER FUNCTION: PARSE OUT CURRENT DATE FROM JS-DATE-OBJ AND SET AS VALUE FOR DATE-INPUT
function dateSetter() {
  let currentDate = new Date();
  let currentMonth = (currentDate.getMonth() + 1).toString();

  if (currentMonth.length < 2) {
    currentMonth = `0${currentMonth}`;
  }

  let currentDay = currentDate.getDate().toString();

  if (currentDay.length < 2) {
    currentDay = `0${currentDay}`;
  }

  let currentYear = (currentDate.getYear() + 1900).toString();
  let today = `${currentMonth}/${currentDay}/${currentYear}`;

  $('#date').val(today);
}

// FUNCTION: GEOLOCATE USER'S COORDINATES, SAVE INTO selectedEventObj AND SET LOCATION AS LOCATION-INPUT VALUE
function geoLocate() {
  let seatGeekURLGeoLocation = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&geoip=true`;

  fetch(seatGeekURLGeoLocation)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => {
      let currentLocation = responseJson.meta.geolocation.display_name;
      selectedEventObj.origLocationCoors.lat = responseJson.meta.geolocation.lat;
      selectedEventObj.origLocationCoors.long = responseJson.meta.geolocation.lon;

      // SET LOCATION INPUT TO CURRENTLOCATION
      $('.e-search').val(currentLocation);
    });
}

// FUNCTIONS: DISPLAY LOADER
function displayLoader() {
  $('.spinner-bg').css('display', 'flex');
}

// FUNCTIONS: HIDE LOADER
function hideLoader() {
  $('.spinner-bg').css('display', 'none');
}

// FUNCTIONS: TIME-PARSER: PARSE AND FORMAT DATE FROM RESULTS
function timeParser(dateObj) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let date = dateObj.split('T')[0];
  let time = dateObj.split('T')[1];
  let year = date.substring(0, 4);
  let month = months[Number(date.substring(5).substring(0, 2)) - 1];
  let day = date.substring(5).substring(3);
  let dateString = `${month} ${day} ${year}`;
  let hours = time.substring(0, 2);
  let dayOrNight;

  hours < 12 ? (dayOrNight = 'AM') : (dayOrNight = 'PM');
  hours > 12 ? (hours = hours - 12) : (hours = hours);

  let minutes = time.substring(2).substring(1, 3);
  let timestring = `${hours}:${minutes}${dayOrNight}`;

  return [dateString, timestring];
}

// FUNCTIONS: GOOGLE AUTO-COMPLETE CALLBACKS
function activateEventLocationSearch() {
  let eventLocationInput = document.getElementById('event-location');
  let autocomplete = new google.maps.places.Autocomplete(eventLocationInput);
}

function activateRestaurantLocationSearch() {
  let restaurantLocationInput = document.getElementById('restaurant-location');
  let autocomplete = new google.maps.places.Autocomplete(restaurantLocationInput);
}

// FUNCTIONS: PAGE-GENERATOR: HOME
function mainPageGenerator() {
  return `<div class="hero">
			<div class="hero-msg">
				<h2>Plan Your Perfect Date Today!</h2>
			</div>
		</div>
		<div class="cta">
			<button class="start-btn">START PLANNING</button>
		</div>
	`;
}

// FUNCTIONS: PAGE-GENERATOR: EVENTS
function entertainmentPageGenerator() {
  return `	
		<form action="" class="event-search-form">
			<legend><h2>Search and Select Event</h2></legend>
				<label>Location (format: city, state-code)
					<input type="text" class="search-input e-search location" placeholder="Location" id="event-location">
				</label>
			<div class="date-range-div">
				<label>Date
					<input type="text" id="date" value="06/11/2019"/>
				</label>
				<label>Range (in Miles)
					<input type="number" id="range" value=10 />
				</label>
			</div>
				<button type="submit" class="submit-btn">Search</button>
		</form>
		<div class="results"></div>
	    <div class="no-results"></div>
		<div id="places"></div>
		<div class="paginate-div">
			<div class="paginate-prev"></div>
			<div class="paginate-events"></div>
			<div class="paginate-next"></div>
		</div>
	   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc&libraries=places&callback=activateEventLocationSearch"></script>

`;
}

// FUNCTIONS: PAGE-GENERATOR: RESTAURANTS
function foodAndDrinksPageGenerator() {
  return `
		<form action="" class="yelp-search-form">
            <legend>
                <h2>Search/Select Restaurant</h2>
            </legend>			
            <label>Cuisine (Leave Blank for All Results):
                <input type="text" class="search-input yelp-queryString" placeholder="Mexican, Chinese, Korean..." id="cuisine">		
            </label>    
            <label>Location:
                <input type="text" class="search-input location yelp-locations" placeholder="Location" id="restaurant-location">
            </label>			
            <label>Range (in Miles):
                <input type="number" class="search-input zomato-range" placeholder="" id="restaurant-range">
            </label>
            <button type="submit" class="submit-btn">Search</button>
        </form>
		<div class="results"></div>
        <div class="no-results"></div>
		<div class="paginate-div">
			<div class="paginate-prev"></div>
			<div class="paginate-events"></div>
			<div class="paginate-next"></div>
		</div>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc&libraries=places&callback=activateRestaurantLocationSearch"></script>
    `;
}

// FUNCTIONS: APPEND-PAGE
function appendPage(page) {
  backBtnDisabler();
  forwardBtnDisable();
  selectedEventObj.historyCounter++;

  $('main').empty();
  $('main').append(page);

  if (selectedEventObj.historyCounter === 2 && selectedEventObj.eventSelected) {
    $('.e-search').val(selectedEventObj.eventLocation);
  }

  if (selectedEventObj.historyCounter === 3 && selectedEventObj.restaurantSelected) {
    $('.yelp-locations').val(selectedEventObj.restaurantLocation);
    $('.yelp-queryString').val(selectedEventObj.zomatoSearchQuery);
  }

  if (selectedEventObj.historyCounter === 2) {
    $(function () {
      $('#date').datepicker();
    });
  }
}

// FUNCTIONS: PAGINATE-ACTIVE-LINK
function activeLinkColored(paginateCounter) {
  // RESET ALL PAGINATE-LINKS TO WHITE
  $('.paginate').css('color', 'white');

  // LOOP THRU PAGINATE-LINKS AND COLOR THE LINK-NUMBER THAT EQUALS THE PAGINATE-COUNTER
  let activeLink = $('.paginate');

  for (let i = 0; i < activeLink.length; i++) {
    if (Number(activeLink[i].textContent) === paginateCounter) {
      $(activeLink[i]).css('color', '#AEFFD8');
    }
  }
}

// FUNCTIONS: HANDLE-EVENT-RESULTS
function handleEventResults(responseJson) {
  // store results from SeatGeekAPI in eventsArr
  let eventsArr = responseJson.events;
  let resultDiv;

  // NO-RESULTS HANDLER
  if (eventsArr.length === 0) {
    resultDiv = `
                <div class="eventResults noResults">
                    No listed events in <span class="noResultsLocation">${selectedEventObj.origLocation}</span>
                </div>`;
    $('.no-results').append(resultDiv);
  }

  // LOOP THRU EVENT RESULTS ARRAY AND EXTRACT RELEVANT DETAILS FOR RESULT-CARDS
  for (let i = 0; i < eventsArr.length; i++) {
    let eventTitle = eventsArr[i].title;
    let eventDateTime = eventsArr[i].datetime_local;
    let eventURL = eventsArr[i].url;
    let eventVenue = eventsArr[i].venue.name;
    let eventID = eventsArr[i].id;
    let eventIMG = eventsArr[i].performers[0].image;
    let eventCoors = {
      lat: eventsArr[i].venue.location.lat,
      lon: eventsArr[i].venue.location.lon,
    };

    let eventPrice = `~$${eventsArr[i].stats.average_price * 2}`;

    // IF EVENT-PRICE IS $0, THEN EVENT-PRICE IS N/A
    if (eventPrice === '~$0') {
      eventPrice = '<i>N/A</i>';
    }

    // GET-REQUEST TO GOOGLE-GEOCODE-API TO EXTRACT/FORMAT EVENT ADDRESSES
    const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventCoors.lat},${eventCoors.lon}&key=${selectedEventObj.googleApiKey}`;

    fetch(googleApiURL)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((responseJson) => {
        // STORE FORMATTED ADDRESS INTO eventAddress AND EXTRACT STREET/CITY/STATE+ZIP
        let eventAddress = responseJson.results[0].formatted_address;
        let eventAddressSplit = eventAddress.split(',');
        let eventStreet = eventAddressSplit[0];
        let eventCity = eventAddressSplit[1].substring(1);
        let eventStateZip = eventAddressSplit[2].substring(1);

        // FORMAT ADDRESS TO INSERT INTO GOOGLE MAPS DIRECTIONS LINK FROM ORIGINAL-LOCATION TO EVENT-DESTINATION
        let addressArr = eventAddress.split(' ');
        let eventAddressURI = addressArr.join('+');
        let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${selectedEventObj.origLocation}&destination=${eventAddressURI}`;

        // CREATE RESULT-CARDS WITH ALL RELEVANT INFO
        resultDiv = `
                    <div class="eventResults" id=${eventID}>
                        <header>${eventTitle}</header>
                        <button class="event-select"> SELECT </button>
                        <span class="eventDateTime">
                            <i class="far fa-calendar"></i>
                            ${timeParser(eventDateTime)[0]} @ ${timeParser(eventDateTime)[1]}
                        </span>
                        <div class="responsive-div">
                            <div class="responsive-left">
                                <div class="event-img-wrapper">
                                    <img src="${eventIMG}" class="event-img">
                                </div>
                            </div>
                            <div class="responsive-right">
                                <div class="event-venue-address">
                                    <span class="eventVenue">${eventVenue}</span>

                                    <span class="eventAddress">
                                        <span class="eventStreet">${eventStreet}</span>
                                        <span class="eventCityStateZip">${eventCity}, ${eventStateZip}</span>
                                    </span>

                                    <span class="eventDirections">
                                        <i class="fas fa-directions"></i> 
                                        <a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
                                    </span>
                                </div>
                                <span class="event-price">
                                    <i class="fas fa-ticket-alt"></i> Price x 2: <span class="eventCostVal">${eventPrice}</span>
                                    <div class="event-btn-wrapper">
                                        <a href="${eventURL}" target="_blank">
                                            <button class="eventURL">TICKETS</button>
                                        </a>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>`;

        // APPEND EVENT-RESULT-CARDS
        $('.results').append(resultDiv);

        // CHECK TO SEE IF EVENT-IMG IS NOT-AVAILABLE AND REPLACE IMAGE WITH 'IMAGE NOT AVAILABLE' TEXT
        let imgArr = $('.event-img');

        for (let i = 0; i < imgArr.length; i++) {
          if (imgArr[i].src.includes('null')) {
            imgArr[i].parentNode.append('image not available');
            imgArr[i].remove();
          }
        }
      });
  }
}

// FUNCTIONS: PAGINATE-EVENT-RESULTS
function paginateEventResults(responseJson) {
  // CALCULATE TOTAL PAGINATE-LINKS
  let totalLinks = Math.ceil(responseJson.meta.total / responseJson.meta.per_page);
  let paginateLinkArr = [];
  let paginateCounter = 1;

  // PUSH LINK TAGS CORRESPONDING TO TOTAL NUMBER OF RESULT-LINKS INTO paginateLinkArr ARRAY
  for (let i = 1; i <= totalLinks; i++) {
    paginateLinkArr.push(`<a href="#" class="paginate">${i}</a>`);
  }

  // LOOP THRU paginateLinkArr ARRAY TO APPEND 10-PAGINATE-LINKS at a time
  for (let i = 0; i < 10; i++) {
    $('.paginate-events').append(paginateLinkArr[i]);
  }

  // SET LINK-1 TO ACTIVE
  let activeLink = $('.paginate');
  $(activeLink[0]).css('color', '#AEFFD8');

  // CREATE NEXT-LINK AND APPEND TO EXISTING PAGINATE-LINKS DIV
  let next = `<a href="#" class="next">>></a>`;
  $('.paginate-next').append(next);

  // CREATE NEXT-LINK AND APPEND TO EXISTING PAGINATE-LINKS DIV
  let prev = `<a href="#" class="prev"><<</a>`;
  $('.paginate-prev').append(prev);

  // FUNCTION: DISABLE PREV/NEXT BTNS
  function disablePrevNextBtns() {
    paginateCounter === 1 ? $('.prev').hide() : $('.prev').show();
    paginateCounter === totalLinks ? $('.next').hide() : $('.next').show();
  }

  // DISABLE PREV/NEXT BTNS
  disablePrevNextBtns();

  // PREV CLICK-HANDLER
  $('.prev').on('click', (e) => {
    e.preventDefault();
    // DECREMENT PAGINATE-COUNTER BY 1 AND DISABLE PREV/NEXT BTNS IF NECESSARY
    paginateCounter = Number(paginateCounter - 1);
    disablePrevNextBtns();

    // MAKE GET-REQUEST TO PREVIOUS PAGE
    let seatGeekPage = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&lat=${selectedEventObj.origLocationCoors.lat}&lon=${selectedEventObj.origLocationCoors.long}&range=${selectedEventObj.eventSearchRange}mi&datetime_local.gte=${selectedEventObj.eventSearchDate}&sort=datetime_local.asc&per_page=10&page=${paginateCounter}`;

    fetch(seatGeekPage)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          hideLoader();
          throw new Error(response.statusText);
        }
      })
      .then((responseJson) => {
        // EMPTY PREVIOUS RESULTS AND HANDLE NEW RESULTS
        $('.results').empty();

        // REGISTER ACTIVE-LINK-HANDLER
        activeLinkColored(paginateCounter);

        handleEventResults(responseJson);

        // IF USER IS ON LAST SET OF 10 PAGINATE-LINKS ON PAGE AND CLICKS "PREV" EMPTY CURRENT SET OF PAGINATE-LINKS
        if (paginateCounter % 10 === 0) {
          $('.paginate-events').empty();

          // AND APPEND NEXT 10 LINKS
          for (let i = paginateCounter - 10; i < paginateCounter; i++) {
            $('.paginate-events').append(paginateLinkArr[i]);
          }

          // RE-REGISTER ACTIVE-LINK-HANDLER
          activeLinkColored(paginateCounter);

          // RE-REGISTER CLICK-HANDLER FOR PAGINATE-LINKS
          paginateLinkHandler();
        }
      });
  });

  // PAGINATE-LINK-HANDLER FUNCTION
  function paginateLinkHandler() {
    $('.paginate').on('click', (e) => {
      e.preventDefault();

      // SET PAGINATE-COUNTER TO LINK'S TEXT-CONTENT
      paginateCounter = Number(e.target.textContent);

      disablePrevNextBtns();

      // MAKE GET-REQUEST TO CORRESPONDING NUMBER OF LINK
      let seatGeekPage = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&lat=${selectedEventObj.origLocationCoors.lat}&lon=${selectedEventObj.origLocationCoors.long}&range=${selectedEventObj.eventSearchRange}mi&datetime_local.gte=${selectedEventObj.eventSearchDate}&sort=datetime_local.asc&per_page=10&page=${paginateCounter}`;

      fetch(seatGeekPage)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((responseJson) => {
          // EMPTY PREVIOUS RESULTS
          $('.results').empty();

          // ACTIVE-LINK
          $('.paginate').css('color', 'white');
          $(e.currentTarget).css('color', '#AEFFD8');

          // EXTRACT AND APPEND ALL RELEVANT INFO INTO RESULT-CARDS
          handleEventResults(responseJson);
        });
    });
  }

  // REGISTER PAGINATE-LINK CLICK-HANDLER
  paginateLinkHandler();

  // NEXT-LINK CLICK-HANDLER: FETCH NEXT PAGE, AND HANDLE RESULTS
  $('.next').on('click', (e) => {
    e.preventDefault();

    // INCREMENT PAGINATE-COUNTER
    paginateCounter = Number(paginateCounter + 1);

    disablePrevNextBtns();

    // MAKE GET-REQUEST TO NEXT PAGE
    let seatGeekPage = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&lat=${selectedEventObj.origLocationCoors.lat}&lon=${selectedEventObj.origLocationCoors.long}&range=${selectedEventObj.eventSearchRange}mi&datetime_local.gte=${selectedEventObj.eventSearchDate}&sort=datetime_local.asc&per_page=10&page=${paginateCounter}`;

    fetch(seatGeekPage)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          hideLoader();
          throw new Error(response.statusText);
        }
      })
      .then((responseJson) => {
        // EMPTY PREVIOUS RESULTS AND APPEND NEW PAGE
        $('.results').empty();

        // REGISTER ACTIVE-LINK-HANDLER
        activeLinkColored(paginateCounter);

        handleEventResults(responseJson);

        // IF PREVIOUS-PAGE WAS THE LAST OF 10-PAGINATE-LINKS PER PAGE
        if ((paginateCounter - 1) % 10 === 0) {
          // EMPTY CURRENT SET OF PAGINATE-LINKS
          $('.paginate-events').empty();

          // APPEND NEXT 10 LINKS
          for (let i = paginateCounter - 1; i < paginateCounter - 1 + 10; i++) {
            $('.paginate-events').append(paginateLinkArr[i]);
          }

          // RE-REGISTER ACTIVE-LINK-HANDLER
          activeLinkColored(paginateCounter);

          // RE-REGISTER PAGINATE-LINK CLICK-HANDLER
          paginateLinkHandler();
        }
      });
  });
}

// FUNCTIONS: PAGINATE-ZOMATO-RESULTS
function paginateZomatoResults(foodanddrink) {
  let totalResults = foodanddrink.results_found;
  let resultsPerPage = foodanddrink.results_shown;
  let totalLinks = Math.ceil(totalResults / resultsPerPage);
  let paginateLinkArr = [];
  let paginateCounter = 1;

  // PUSH LINK TAGS CORRESPONDING TO TOTAL NUMBER OF RESULT-LINKS INTO paginateLinkArr ARRAY
  for (let i = 1; i <= totalLinks; i++) {
    paginateLinkArr.push(`<a href="#" class="paginate">${i}</a>`);
  }

  // LOOP THRU paginateLinkArr ARRAY TO APPEND 10-PAGINATE-LINKS at a time
  for (let i = 0; i < 10; i++) {
    $('.paginate-events').append(paginateLinkArr[i]);
  }

  // SET LINK-1 TO ACTIVE
  let activeLink = $('.paginate');
  $(activeLink[0]).css('color', '#AEFFD8');

  // CREATE NEXT-LINK AND APPEND TO EXISTING PAGINATE-LINKS DIV
  let next = `<a href="#" class="next">>></a>`;
  $('.paginate-next').append(next);

  // CREATE NEXT-LINK AND APPEND TO EXISTING PAGINATE-LINKS DIV
  let prev = `<a href="#" class="prev"><<</a>`;
  $('.paginate-prev').append(prev);

  // FUNCTION: DISABLE PREV/NEXT BTNS
  function disablePrevNextBtns(paginateCounter) {
    paginateCounter === 1 ? $('.prev').hide() : $('.prev').show();
    paginateCounter === totalLinks ? $('.next').hide() : $('.next').show();
  }

  // DISABLE PREV/NEXT BTNS
  disablePrevNextBtns(paginateCounter);

  // PREV CLICK-HANDLER
  $('.prev').on('click', (e) => {
    e.preventDefault();
    // DECREMENT PAGINATE-COUNTER BY 1 AND DISABLE PREV/NEXT BTNS IF NECESSARY
    paginateCounter = Number(paginateCounter - 1);
    disablePrevNextBtns(paginateCounter);

    const headers = {
      headers: {
        'user-key': '9fc6bb49836d20f169da8151581bde82',
      },
    };

    let zomatoSearchQuery = $('.yelp-queryString').val();

    // MAKE GET-REQUEST TO PREVIOUS PAGE
    let zomatoRadius = $('.zomato-range').val() * 1609.34;

    zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${selectedEventObj.eventCoors.lat}&lon=${selectedEventObj.eventCoors.long}&radius=${zomatoRadius}&start=${paginateCounter}&count=10&sort=real_distance&order=asc`;

    fetch(zomatoApiURL, headers)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          hideLoader();
          throw new Error(response.statusText);
        }
      })
      .then((responseJson) => {
        // EMPTY PREVIOUS RESULTS AND HANDLE NEW RESULTS
        $('.results').empty();

        activeLinkColored(paginateCounter);

        handleZomatoResults(responseJson);

        // IF USER IS ON LAST SET OF 10 PAGINATE-LINKS ON PAGE AND CLICKS "PREV" EMPTY CURRENT SET OF PAGINATE-LINKS
        if (paginateCounter % 10 === 0) {
          $('.paginate-events').empty();

          // AND APPEND NEXT 10 LINKS
          for (let i = paginateCounter - 10; i < paginateCounter; i++) {
            $('.paginate-events').append(paginateLinkArr[i]);
          }

          activeLinkColored(paginateCounter);

          // RE-REGISTER CLICK-HANDLER FOR PAGINATE-LINKS
          paginateLinkHandler();
        }
      });
  });

  // PAGINATE-LINK-HANDLER FUNCTION
  function paginateLinkHandler() {
    $('.paginate').on('click', (e) => {
      e.preventDefault();

      // SET PAGINATE-COUNTER TO LINK'S TEXT-CONTENT
      paginateCounter = Number(e.target.textContent);

      disablePrevNextBtns(paginateCounter);

      let zomatoSearchQuery = $('.yelp-queryString').val();

      let zomatoRadius = $('.zomato-range').val() * 1609.34;

      const headers = {
        headers: {
          'user-key': '9fc6bb49836d20f169da8151581bde82',
        },
      };

      // MAKE GET-REQUEST TO CORRESPONDING NUMBER OF LINK
      let zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${selectedEventObj.eventCoors.lat}&lon=${selectedEventObj.eventCoors.long}&radius=${zomatoRadius}&start=${paginateCounter}&count=10&sort=real_distance&order=asc`;

      fetch(zomatoApiURL, headers)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((responseJson) => {
          // EMPTY PREVIOUS RESULTS
          $('.results').empty();

          activeLinkColored(paginateCounter);

          // EXTRACT AND APPEND ALL RELEVANT INFO INTO RESULT-CARDS
          handleZomatoResults(responseJson);
        });
    });
  }

  // REGISTER PAGINATE-LINK CLICK-HANDLER
  paginateLinkHandler();

  // NEXT-LINK CLICK-HANDLER: FETCH NEXT PAGE, AND HANDLE RESULTS
  $('.next').on('click', (e) => {
    e.preventDefault();

    // INCREMENT PAGINATE-COUNTER
    paginateCounter = Number(paginateCounter + 1);

    disablePrevNextBtns(paginateCounter);

    let zomatoSearchQuery = $('.yelp-queryString').val();

    let zomatoRadius = $('.zomato-range').val() * 1609.34;

    const headers = {
      headers: {
        'user-key': '9fc6bb49836d20f169da8151581bde82',
      },
    };
    // MAKE GET-REQUEST TO NEXT PAGE
    let zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${selectedEventObj.eventCoors.lat}&lon=${selectedEventObj.eventCoors.long}&radius=${zomatoRadius}&start=${paginateCounter}&count=10&sort=real_distance&order=asc`;

    fetch(zomatoApiURL, headers)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          hideLoader();
          throw new Error(response.statusText);
        }
      })
      .then((responseJson) => {
        // EMPTY PREVIOUS RESULTS AND APPEND NEW PAGE
        $('.results').empty();

        // ACTIVE LINK
        activeLinkColored(paginateCounter);

        handleZomatoResults(responseJson);

        // IF PREVIOUS-PAGE WAS THE LAST OF 10-PAGINATE-LINKS PER PAGE
        if ((paginateCounter - 1) % 10 === 0) {
          // EMPTY CURRENT SET OF PAGINATE-LINKS
          $('.paginate-events').empty();

          // APPEND NEXT 10 LINKS
          for (let i = paginateCounter - 1; i < paginateCounter - 1 + 10; i++) {
            $('.paginate-events').append(paginateLinkArr[i]);
          }

          activeLinkColored(paginateCounter);
          // RE-REGISTER PAGINATE-LINK CLICK-HANDLER
          paginateLinkHandler();
        }
      });
  });
}

// FUNCTIONS: HANDLE-ZOMATO-RESULTS
function handleZomatoResults(foodanddrink) {
  let foodAndDrinkArr = foodanddrink.restaurants;

  // NO-RESULTS HANDLER
  if (foodAndDrinkArr.length === 0) {
    let resultDiv = `
                    <div class="eventResults noResults">
                        No <span class="noResultsQuery">${zomatoSearchQuery} </span> restaurants in <span class="noResultsLocation">${selectedEventObj.eventLocation}</span>
                    </div>`;

    $('.no-results').append(resultDiv);
  } else {
    // EXTRACT ALL RELEVANT INFO FROM ZOMATO-API CALL
    for (let i = 0; i < foodAndDrinkArr.length; i++) {
      let zomatoName = foodAndDrinkArr[i].restaurant.name;
      let zomatoCuisines = foodAndDrinkArr[i].restaurant.cuisines;
      let zomatoMenuURL = foodAndDrinkArr[i].restaurant.menu_url;
      let zomatoDetailsURL = foodAndDrinkArr[i].restaurant.url;
      let zomatoPrice = `~$${foodAndDrinkArr[i].restaurant.average_cost_for_two}`;

      if (zomatoPrice === '~$0') {
        zomatoPrice = '<i>N/A</i>';
      }

      let zomatoID = foodAndDrinkArr[i].restaurant.R.res_id;
      let zomatoIMG = foodAndDrinkArr[i].restaurant.thumb;
      let zomatoLat = foodAndDrinkArr[i].restaurant.location.latitude;
      let zomatoLong = foodAndDrinkArr[i].restaurant.location.longitude;

      const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`;

      // USE EXTRACTED LAT/LONG TO MAKE A CALL TO GOOGLE-API TO GET FORMATTED ADDRESS
      fetch(googleApiURL)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        })
        .then((responseJson) => {
          let zomatoAddress = responseJson.results[0].formatted_address;
          let zomatoAddressSplit = zomatoAddress.split(',');
          let zomatoStreet = zomatoAddressSplit[0];
          let zomatoCity = zomatoAddressSplit[1].substring(1);
          let zomatoStateZip = zomatoAddressSplit[2].substring(1);
          let addressArr = zomatoAddress.split(' ');
          let zomatoAddressURI = addressArr.join('+');
          let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+');
          let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${zomatoAddressURI}`;
          let zomatoResIdURL = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${zomatoID}`;

          const headers = {
            headers: {
              'user-key': '9fc6bb49836d20f169da8151581bde82',
            },
          };

          fetch(zomatoResIdURL, headers)
            .then((response) => {
              displayLoader();
              if (response.status === 200) {
                return response.json();
              } else {
                throw new Error(response.statusText);
              }
            })
            .then((resID) => {
              hideLoader();

              let zomatoRatings = `Ratings: ${resID.user_rating.aggregate_rating}/5`;

              if (resID.user_rating.aggregate_rating === 0) {
                zomatoRatings = `<i>${resID.user_rating.rating_text}</i>`;
              }

              selectedEventObj.restaurantRatings = zomatoRatings;

              let zomatoIMG2 = resID.featured_image;

              selectedEventObj.restaurantIMG2 = zomatoIMG2;

              let zomatoPhoneNumber = resID.phone_numbers;

              selectedEventObj.restaurantPhone = zomatoPhoneNumber;

              if (zomatoPhoneNumber.includes(',')) {
                zomatoPhoneNumber = zomatoPhoneNumber.split(',')[0];
              }

              let resultDiv = `
                            <div class="zomatoResults" id="${zomatoID}">
                                <header>${zomatoName}</header>
                                <button class="event-select">SELECT</button>
                                <span class="eventDateTime">
                                    <i class="fas fa-utensils"></i>
                                    <i>${zomatoCuisines}</i>
                                </span>
                                <span class="zomato-ratings">
                                    <strong>${zomatoRatings}</strong>
                                </span>
                                <div class="responsive-div">
                                    <div class="responsive-left">
                                    <div class="zomato-img-wrapper">
                                        <img src="${zomatoIMG}" class="zomato-img" />
                                    </div>
                                    </div>
                                    <div class="responsive-right">
                                    <div class="event-venue-address">
                                        <span class="eventAddress">
                                        <span class="zomatoStreet">${zomatoStreet}</span>
                                        <span class="zomatoCityStateZip">${zomatoCity}, ${zomatoStateZip}</span>
                                        </span>
                                        <span class="eventDirections">
                                        <i class="fas fa-directions"></i>
                                        <a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
                                        </span>
                                        <span class="zomato-phoneNumber">
                                        <i class="fas fa-phone"></i>
                                        <a href="tel:${zomatoPhoneNumber}" class="zomato-phone-link">${zomatoPhoneNumber}</a>
                                        </span>
                                    </div>
                                    <span class="zomato-price">
                                        <i class="fas fa-money-bill"></i>
                                        <strong>
                                        Price x 2:
                                        <span class="eventCostVal">${zomatoPrice}</span>
                                        </strong>
                                    </span>
                                    <div class="result-btns-wrapper">
                                        <a href="${zomatoMenuURL}" target="_blank"><button class="eventURL">MENU</button></a>
                                        <a href="${zomatoDetailsURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            `;

              // APPEND RESULT-DIVS
              $('.results').append(resultDiv);

              // LOOP THRU RESULTS AND IF IMAGE IS NOT AVAILABLE, REPLACE IMG WITH "IMAGE NOT AVAILABLE"
              let imgArr = $('.zomato-img');

              for (let i = 0; i < imgArr.length; i++) {
                if (!imgArr[i].src.includes('zmtcdn') && zomatoIMG2 === '') {
                  imgArr[i].parentNode.append('image not available');
                  imgArr[i].remove();
                } else if (!imgArr[i].src.includes('zmtcdn') && zomatoIMG2 !== '') {
                  imgArr[i].parentNode.append(zomatoIMG2);
                  imgArr[i].remove();
                }
              }
            });
        });
    }
  }
}

// NAV-BAR-HANDLERS
function navBarHandlers() {
  // NAVBAR: HOME-LOGO
  $('.home-logo').on('click', (e) => {
    selectedEventObj.historyCounter = 0;
    appendPage(mainPageGenerator());
    selectedEventObj = selectedEventObjReset;
    $('.menu').hide();
    $('main').show();
  });

  // HAMBURGER-MENU
  $('.hamburger').on('click', (e) => {
    selectedEventObj.showMenu = !selectedEventObj.showMenu;

    if (selectedEventObj.showMenu) {
      $('main').hide();
      $('.menu').show();
    } else {
      $('main').show();
      $('.menu').hide();
    }
  });

  // HAMBURGER-MENU: HOME
  $('.menu .home').on('click', (e) => {
    selectedEventObj.historyCounter = 0;
    appendPage(mainPageGenerator());
    selectedEventObj = selectedEventObjReset;
    $('.menu').hide();
    $('main').show();
  });

  $('.nav-new').on('click', (e) => {
    selectedEventObj.historyCounter = 0;
    appendPage(mainPageGenerator());
    selectedEventObj = selectedEventObjReset;
  });

  // HAMBURGER-MENU: BACK
  $('.back').on('click', (e) => {
    $('.menu').hide();
    selectedEventObj.historyCounter = selectedEventObj.historyCounter - 2;
    appendPage(selectedEventObj.history[selectedEventObj.historyCounter]);
    $('main').show();
  });
}

// CLICK-AND-SUBMIT-HANDLERS
function clickAndSubmitHandlers() {
  // START-BTN
  $('main').on('click', '.start-btn', (e) => {
    appendPage(selectedEventObj.history[selectedEventObj.historyCounter]);
    geoLocate();
    dateSetter();
  });

  // EVENT-SEARCH-SUBMIT
  $('main').on('submit', '.event-search-form', (e) => {
    e.preventDefault();

    displayLoader();

    let locationInput = $('.e-search').val();

    // CLEAR ANY RESULTS FROM PREVIOUS SEARCH
    $('.results').empty();
    $('.no-results').empty();

    // CLEAR PAGINATION LINKS
    $('.paginate-events').empty();
    $('.paginate-prev').empty();
    $('.paginate-next').empty();

    // PARSE DATE TO PROPER FORMAT FOR SEATGEEK API
    let currentDate = $('#date').val().split('/');
    let formattedCurrentDate = `${currentDate[2]}-${currentDate[0]}-${currentDate[1]}`;

    selectedEventObj.eventSearchDate = formattedCurrentDate;

    // AUTHENTICATE EVENT-SEARCH-FORM
    let locationRegex = /\D+,\s\D{2}/;

    if (
      $('.e-search').val().split(',')[0] === undefined ||
      $('.e-search').val().split(',')[1] === undefined ||
      locationRegex.test(locationInput) === false ||
      locationRegex.test(locationInput) === false
    ) {
      alert('Please make sure your location is in the correct format: city, state');
      hideLoader();
      return;
    }

    let dateRegex = /\d{2}\/\d{2}\/\d{4}/;

    if (!dateRegex.test($('#date').val())) {
      alert('Please make sure your date is in the correct format: MM/DD/YYYY');
      hideLoader();
      return;
    }

    // PARSE CITY AND STATE FORM USER-INPUT AND STORE IN SELECTEDEVENTOBJ
    let city = $('.e-search').val().split(',')[0].trim();
    let state = $('.e-search').val().split(',')[1].trim();

    selectedEventObj.origLocation = `${city}, ${state}`;

    // SET RANGE BASED ON USER-INPUT
    let range = $('#range').val();
    selectedEventObj.eventSearchRange = range;

    // IF USER CHANGES LOCATION FROM ORIGINAL GEOLOCATION LOCATION,
    if ($('.e-search').val() !== selectedEventObj.origLocation) {
      // MAKE A GET-REQUEST TO GOOGLEAPI TO OBTAIN LAT/LONG OF NEW LOCATION BASED ON CITY/STATE
      let googleGetCoorsURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}${state}&key=${selectedEventObj.googleApiKey}`;

      fetch(googleGetCoorsURL)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((coors) => {
          // STORE NEW EVENT-LOCATION COORDINATES IN SELECTED-EVENT-OBJ
          selectedEventObj.origLocationCoors.lat = coors.results[0].geometry.location.lat;
          selectedEventObj.origLocationCoors.long = coors.results[0].geometry.location.lng;

          // AND MAKE A GET-REQUEST TO SEATGEEKAPI WITH NEW COORDINATES
          let seatGeekURLgeo = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&lat=${selectedEventObj.origLocationCoors.lat}&lon=${selectedEventObj.origLocationCoors.long}&range=${selectedEventObj.eventSearchRange}mi&datetime_local.gte=${selectedEventObj.eventSearchDate}&sort=datetime_local.asc&per_page=10&page=1`;

          fetch(seatGeekURLgeo)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                hideLoader();
                throw new Error(response.statusText);
              }
            })
            .then((responseJson) => {
              hideLoader();

              // EXTRACT ALL RELEVANT INFO FROM SEATGEEKAPI + GOOGLEAPI AND APPEND RESULT-CARDS
              handleEventResults(responseJson);

              // PAGINATE RESULTS
              paginateEventResults(responseJson);
            });
        });
    } else {
      // ELSE, IF EVENT-LOCATION IS SAME AS GEOLOCATION LINK

      // THEN USE COORDS STORED IN SELECTED-EVENT-OBJ TO MAKE A GET-REQUEST TO SEATGEEKAPI
      let seatGeekURLcityState = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&lat=${selectedEventObj.origLocationCoors.lat}&lon=${selectedEventObj.origLocationCoors.long}&range=${selectedEventObj.eventSearchRange}mi&datetime_local.gte=${selectedEventObj.eventSearchDate}&sort=datetime_local.asc&per_page=10&page=1`;

      fetch(seatGeekURLcityState)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((responseJson) => {
          hideLoader();

          // EXTRACT ALL RELEVANT INFO FROM SEATGEEKAPI + GOOGLEAPI AND APPEND RESULT-CARDS
          handleEventResults(responseJson);

          // PAGINATE SEATGEEKAPI SEARCH RESULTS
          paginateEventResults(responseJson);
        });
    }
  });

  // EVENT-SELECT
  $('main').on('click', '.eventResults > .event-select', (e) => {
    displayLoader();

    // WHEN USER SELECTS EVENT, TRAVERSE THE DOM TO EXTRACT EVENT'S ID
    let selectedEventID;

    if (e.target.id) {
      selectedEventID = e.target.id;
    } else {
      selectedEventID = $(e.target).parents('.eventResults')[0].id;
    }

    // ADD SELECTED-EVENT CLASS TO SELECTED-EVENT
    if (e.target.className !== 'eventURL') {
      $(`#${selectedEventID}`).addClass('selected-event');
    }

    // MAKE FETCH-CALL TO SEATGEEKAPI BY EVENT-ID
    let seatGeekURLbyID = `https://api.seatgeek.com/2/events/${selectedEventID}?client_id=${selectedEventObj.seatGeekApiKey}`;

    fetch(seatGeekURLbyID)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((event) => {
        hideLoader();

        // STORE EVENT-IMG IN SELECTED-EVENT-OBJ
        selectedEventObj.eventIMG = event.performers[0].image;

        // EXTRACT LAT/LONG COORS OF EVENT-VENUE TO MAKE A CALL TO GOOGLEAPI TO GET FORMATTED ADDRESS
        let eventLat = event.venue.location.lat;
        let eventLong = event.venue.location.lon;

        const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventLat},${eventLong}&key=${selectedEventObj.googleApiKey}`;

        // MAKE FETCH-CALL TO GOOGLE-API TO GET AND FORMAT SELECTED-EVENT-ADDRESS
        fetch(googleApiURL)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          })
          .then((responseJson) => {
            // STORE ALL RELEVANT-INFO ON SELECTED-EVENT
            selectedEventObj.eventSelected = true;
            selectedEventObj.eventName = event.title;
            selectedEventObj.eventTime = event.datetime_local;
            selectedEventObj.eventAddress = responseJson.results[0].formatted_address;
            selectedEventObj.eventID = selectedEventID;
            selectedEventObj.eventDetailsLink = event.url;
            selectedEventObj.eventVenue = event.venue.name;
            selectedEventObj.eventType = event.type;
            selectedEventObj.eventLocation = event.venue.display_location;
            selectedEventObj.eventCost = event.stats.average_price * 2;
            selectedEventObj.eventCoors = {
              lat: event.venue.location.lat,
              long: event.venue.location.lon,
            };

            // MOVE USER TO NEXT-PAGE (RESTAURANT-SELECT/SEARCH PAGE) AND SET LOCATION INPUT TO SELECTED-EVENT'S LOCATION
            appendPage(foodAndDrinksPageGenerator());
            $('.yelp-locations').val(selectedEventObj.eventLocation);
            $('.zomato-range').val(selectedEventObj.eventSearchRange);
          });
      });
  });

  // RESTAURANT-SEARCH-SUBMIT
  $('main').on('submit', '.yelp-search-form', (e) => {
    e.preventDefault();
    displayLoader();

    $('.results').empty();
    $('.no-results').empty();

    // CLEAR PAGINATION LINKS
    $('.paginate-events').empty();
    $('.paginate-prev').empty();
    $('.paginate-next').empty();

    let zomatoSearchQuery = $('.yelp-queryString').val();
    let zomatoLocation = $('.yelp-locations').val();
    let zomatoRadius = $('.zomato-range').val() * 1609.34;
    let zomatoApiURL;

    const headers = {
      headers: {
        'user-key': '9fc6bb49836d20f169da8151581bde82',
      },
    };

    // AUTHENTICATE ZOMATO-LOCATION-INPUT
    let locationRegex = /\D+,\s\D{2}/;

    if (zomatoLocation.split(',')[0] === undefined || zomatoLocation.split(',')[1] === undefined || locationRegex.test(zomatoLocation) === false || locationRegex.test(zomatoLocation) === false) {
      alert('Please make sure your location is in the correct format: city, state');
      hideLoader();
      return;
    }

    // IF RESTAURANT-LOCATION IS DIFFERENT FROM SELECTED-EVENT-LOCATION, FIND COORDINATES OF NEW LOCATION VIA GOOGLE API
    if (zomatoLocation !== selectedEventObj.eventLocation) {
      let zomatoCity = zomatoLocation.split(',')[0].split(' ').join('+');
      let zomatoState = zomatoLocation.split(',')[1].split(' ').join('+');

      let googleGetCoorsURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zomatoCity}${zomatoState}&key=${selectedEventObj.googleApiKey}&sort=real_distance&order=asc`;

      fetch(googleGetCoorsURL)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((coors) => {
          let newLocationLat = coors.results[0].geometry.location.lat;
          let newLocationLng = coors.results[0].geometry.location.lng;

          // USE COORDINATES FOR NEW LOCATION TO MAKE FETCH CALL TO ZOMATO API
          zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${newLocationLat}&lon=${newLocationLng}&radius=${zomatoRadius}&start=0&count=10`;

          fetch(zomatoApiURL, headers)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                hideLoader();
                throw new Error(response.statusText);
              }
            })
            .then((foodanddrink) => {
              handleZomatoResults(foodanddrink);
              paginateZomatoResults(foodanddrink);
              hideLoader();
            });
        });
    } else {
      // IF RESTAURANT-LOCATION IS THE SAME AS EVENT THEN SKIP FETCH CALL FOR COORDINATES TO GOOGLEAPI AND USE STORED COORS IN SELECTED-EVENT-OBJ TO MAKE CALL TO ZOMATO-API
      let zomatoStart = 0;
      let zomatoCount = 10;

      zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${selectedEventObj.eventCoors.lat}&lon=${selectedEventObj.eventCoors.long}&radius=${zomatoRadius}&start=${zomatoStart}&count=${zomatoCount}&sort=real_distance&order=asc`;

      fetch(zomatoApiURL, headers)
        .then((response) => {
          displayLoader();
          if (response.status === 200) {
            return response.json();
          } else {
            hideLoader();
            throw new Error(response.statusText);
          }
        })
        .then((foodanddrink) => {
          hideLoader();
          handleZomatoResults(foodanddrink);
          paginateZomatoResults(foodanddrink);
        });
    }
  });

  // RESTAURANT-SELECT
  $('main').on('click', '.zomatoResults > .event-select', (e) => {
    displayLoader();

    let cuisineQuery = $('.yelp-queryString').val();

    // WHEN USER SELECTS RESTAURANT, TRAVERSE THE DOM TO EXTRACT RESTAURANT'S ID
    let selectedEventID;

    if (e.target.id) {
      selectedEventID = e.target.id;
    } else {
      selectedEventID = $(e.target).parents('.zomatoResults')[0].id;
    }

    // ADD SELECTED-EVENT CLASS TO SELECTED-RESTAURANT
    if (e.target.className !== 'zomatoResults') {
      $(`#${selectedEventID}`).addClass('selected-event');
    }

    // MAKE A GET-REQUEST FOR RESTAURANT DETAILS BASED ON ID AND STORE DETAILS INTO SELECTEDEVENTSOBJ
    const headers = {
      headers: {
        'user-key': '9fc6bb49836d20f169da8151581bde82',
      },
    };

    let zomatoApiURLByID = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${selectedEventID}`;

    fetch(zomatoApiURLByID, headers)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((resDetails) => {
        let zomatoLong = resDetails.location.longitude;
        let zomatoLat = resDetails.location.latitude;

        // USE LAT/LONG COORS TO MAKE CALL TO GOOGLEAPI TO EXTRACT FORMATTED ADDRESS
        const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`;

        fetch(googleApiURL)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          })
          .then((responseJson) => {
            hideLoader();
            let zomatoAddress = responseJson.results[0].formatted_address;
            let restaurantAddressURI = zomatoAddress.split(' ').join('+');
            let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+');
            let restaurantGoogleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${restaurantAddressURI}`;
            let eventGoogleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${selectedEventObj.origLocation}&destination=${eventAddressURI}`;

            selectedEventObj.restaurantIMG = resDetails.thumb;
            selectedEventObj.restaurantName = resDetails.name;
            selectedEventObj.restaurantAddress = zomatoAddress;
            selectedEventObj.restaurantCost = Number(resDetails.average_cost_for_two);
            selectedEventObj.restaurantCoors = {
              lat: Number(resDetails.location.latitude),
              long: Number(resDetails.location.longitude),
            };
            selectedEventObj.restaurantMenu = resDetails.menu_url;
            selectedEventObj.restaurantDetails = resDetails.url;
            selectedEventObj.restaurantFoodType = resDetails.cuisines;
            selectedEventObj.restaurantSelected = true;
            selectedEventObj.zomatoSearchQuery = cuisineQuery;

            let city = selectedEventObj.restaurantAddress.split(',')[1];
            let state = selectedEventObj.restaurantAddress.split(',')[2].split(' ')[1];
            let selectedRestaurantAddy = `${city}, ${state}`;

            selectedEventObj.restaurantLocation = selectedRestaurantAddy;

            let finalPageHTML = `
                                <div class="date-details">
                                    <header class="itin-msg"><h1>Your Date Details</h1></header>
                                    <div class="cost">
                                        <header class="cost-header">
                                        <span class="cost-header-label date-details-clicked">Estimated Total Cost</span>
                                        <h1><span class="cost-header-after">Estimated Total Cost</span></h1>
                                        <i class="fas fa-angle-double-down"></i>
                                        <i class="fas fa-angle-double-up"></i>
                                        </header>
                                        <div class="cost-unfold unfold">
                                            <span class="event-tickets">
                                                <span class="names">1. ${selectedEventObj.eventName}</span>
                                                :
                                                <span class="costVal finalEventCost">$${selectedEventObj.eventCost}</span>
                                            </span>
                                            <span class="dinner-price">
                                                <span class="names">2. ${selectedEventObj.restaurantName}</span>
                                                :
                                                <span class="costVal finalRestaurantCost">$${selectedEventObj.restaurantCost}</span>
                                            </span>
                                            <span class="total-cost">
                                                Total:
                                                <span class="costVal">
                                                $${Number(selectedEventObj.eventCost + selectedEventObj.restaurantCost).toFixed(2)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="event-restaurant-details-wrapper">
                                        <div class="event-details">
                                            <header class="event-header">
                                                <span class="event-header-label date-details-clicked">Event Details</span>
                                                <h1><span class="event-name">${selectedEventObj.eventName}</span></h1>
                                                <i class="fas fa-angle-double-down"></i>
                                                <i class="fas fa-angle-double-up"></i>
                                            </header>
                                            <div class="event-unfold unfold">
                                                <span class="event-time">
                                                <i class="far fa-calendar"></i>
                                                ${timeParser(selectedEventObj.eventTime)[0]} @ ${timeParser(selectedEventObj.eventTime)[1]}
                                                </span>
                                                <div class="responsive-div">
                                                    <div class="responsive-left">
                                                        <div class="event-img-wrapper">
                                                        <img src="${selectedEventObj.eventIMG}" class="event-img" />
                                                        </div>
                                                    </div>
                                                    <div class="responsive-right">
                                                        <div class="event-venue-address">
                                                            <span class="eventVenue">${selectedEventObj.eventVenue}</span>
                                                            <span class="eventAddress">
                                                                <span class="eventStreet">${selectedEventObj.eventAddress.split(',')[0]}</span>
                                                                <span class="eventCityStateZip">
                                                                ${selectedEventObj.eventAddress.split(',')[1].substring(1)},
                                                                ${selectedEventObj.eventAddress.split(',')[2].substring(1)}
                                                                </span>
                                                            </span>
                                                            <span class="eventDirections">
                                                                <i class="fas fa-directions"></i>
                                                                <a href="${eventGoogleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
                                                            </span>
                                                        </div>
                                                        <div class="restaurant-btns-wrapper">
                                                            <a href="${selectedEventObj.eventDetailsLink}" target="_blank">
                                                                <button class="event-link">TICKETS</button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="restaurant-details">
                                            <header class="restaurant-header">
                                                <span class="restaurant-header-label date-details-clicked">Restaurant Details</span>
                                                <h1><span class="restaurant-name">${selectedEventObj.restaurantName}</span></h1>
                                                <i class="fas fa-angle-double-down"></i>
                                                <i class="fas fa-angle-double-up"></i>
                                            </header>
                                            <div class="restaurant-unfold unfold">
                                                <span class="restaurant-foodType">
                                                <i class="fas fa-utensils"></i>
                                                <i>${selectedEventObj.restaurantFoodType}</i>
                                                </span>
                                                <span class="zomato-ratings">
                                                <strong>${selectedEventObj.restaurantRatings}</strong>
                                                </span>
                                                <div class="responsive-div">
                                                    <div class="responsive-left">
                                                        <div class="zomato-img-wrapper">
                                                            <img src="${selectedEventObj.restaurantIMG}" class="zomato-img" />
                                                        </div>
                                                    </div>
                                                    <div class="responsive-right">
                                                        <span class="restaurant-address">
                                                        <span class="eventStreet">${selectedEventObj.restaurantAddress.split(',')[0]}</span>
                                                        <span class="eventCityStateZip">
                                                            ${selectedEventObj.restaurantAddress.split(',')[1].substring(1)},
                                                            ${selectedEventObj.restaurantAddress.split(',')[2].substring(1)}
                                                        </span>
                                                        </span>
                                                        <span class="eventDirections">
                                                            <i class="fas fa-directions"></i>
                                                            <a href="${restaurantGoogleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
                                                        </span>
                                                        <span class="zomato-phoneNumber">
                                                            <i class="fas fa-phone"></i>
                                                            <a href="tel:${selectedEventObj.restaurantPhone}" class="zomato-phone-link">
                                                                ${selectedEventObj.restaurantPhone}
                                                            </a>
                                                        </span>
                                                        <div class="restaurant-btns-wrapper">
                                                            <a href="${selectedEventObj.restaurantMenu}" target="_blank">
                                                                <button class="restaurant-menu">Menu</button>
                                                            </a>
                                                            <a href="${selectedEventObj.restaurantDetails}" target="_blank">
                                                                <button class="restaurant-link">Details</button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
            // APPEND FINAL-PAGE
            appendPage(finalPageHTML);

            // HIDE HEADER-NAMES AND DIVS TO BE UNFOLDED VIA CLICK-EVENT
            $('.cost-header-after').hide();
            $('.cost-unfold').hide();
            $('.event-unfold').hide();
            $('.event-name').hide();
            $('.restaurant-unfold').hide();
            $('.restaurant-name').hide();
            $('.fa-angle-double-up').hide();

            // IF EVENT-COST OR RESTAURANT-COST N/A HANDLER
            if (selectedEventObj.eventCost === 0) {
              $('.finalEventCost').html('N/A');
            }

            if (selectedEventObj.restaurantCost === 0) {
              $('.finalRestaurantCost').html('N/A');
            }

            // CHECK THRU ALL EVENT-IMG AND ZOMATO-IMG AND IF IMAGE IS NOT AVAILABLE, REPLACE IMGS WITH "IMAGE NOT AVAILABLE" TEXT
            let zomatoIMGArr = $('.zomato-img');

            for (let i = 0; i < zomatoIMGArr.length; i++) {
              if (!zomatoIMGArr[i].src.includes('zmtcdn') && selectedEventObj.restaurantIMG2 === '') {
                zomatoIMGArr[i].parentNode.append('image not available');
                zomatoIMGArr[i].remove();
              } else if (!zomatoIMGArr[i].src.includes('zmtcdn') && selectedEventObj.restaurantIMG2 !== '') {
                zomatoIMGArr[i].parentNode.append(selectedEventObj.restaurantIMG2);
                zomatoIMGArr[i].remove();
              }
            }

            let eventIMGArr = $('.event-img');

            for (let i = 0; i < eventIMGArr.length; i++) {
              if (eventIMGArr[i].src.includes('null')) {
                eventIMGArr[i].parentNode.append('image not available');
                eventIMGArr[i].remove();
              }
            }
          });
      });
  });

  // UNFOLD COST-DIV
  $('main').on('click', '.cost-header', (e) => {
    if (!selectedEventObj.costSlide) {
      $('.cost-unfold').hide();
      $('.cost-unfold').slideDown();
      $('.cost-header .fa-angle-double-down').hide();
      $('.cost-header .fa-angle-double-up').show();
      $('.cost-header-label').slideUp();
      $('.cost-header-after').slideDown();
      $('.cost-header').addClass('date-details-clicked');
      selectedEventObj.costSlide = true;
    } else {
      $('.cost-unfold').slideUp();
      $('.cost-header .fa-angle-double-down').show();
      $('.cost-header .fa-angle-double-up').hide();
      $('.cost-header-after').slideUp();
      $('.cost-header-label').slideDown();
      $('.cost-header').removeClass('date-details-clicked');
      selectedEventObj.costSlide = false;
    }
  });

  // UNFOLD EVENT-DIV
  $('main').on('click', '.event-header', (e) => {
    if (!selectedEventObj.eventSlide) {
      $('.event-unfold').hide();
      $('.event-unfold').slideDown();
      $('.event-header .fa-angle-double-down').hide();
      $('.event-header .fa-angle-double-up').show();
      $('.event-header-label').slideUp();
      $('.event-name').slideDown();
      $('.event-header').addClass('date-details-clicked');
      selectedEventObj.eventSlide = true;
    } else {
      $('.event-unfold').slideUp();
      $('.event-header .fa-angle-double-down').show();
      $('.event-header .fa-angle-double-up').hide();
      $('.event-name').slideUp();
      $('.event-header-label').slideDown();
      $('.event-header').removeClass('date-details-clicked');
      selectedEventObj.eventSlide = false;
    }
  });

  // UNFOLD RESTAURANT-DIV
  $('main').on('click', '.restaurant-header', (e) => {
    if (!selectedEventObj.restaurantSlide) {
      $('.restaurant-unfold').hide();
      $('.restaurant-unfold').slideDown();
      $('.restaurant-header .fa-angle-double-down').hide();
      $('.restaurant-header .fa-angle-double-up').show();
      $('.restaurant-header-label').slideUp();
      $('.restaurant-name').slideDown();
      $('.restaurant-header').slideDown();
      $('.restaurant-header').addClass('date-details-clicked');
      selectedEventObj.restaurantSlide = true;
    } else {
      $('.restaurant-unfold').slideUp();
      $('.restaurant-header .fa-angle-double-down').show();
      $('.restaurant-header .fa-angle-double-up').hide();
      $('.restaurant-name').slideUp();
      $('.restaurant-header-label').slideDown();
      $('.restaurant-header').removeClass('date-details-clicked');
      selectedEventObj.restaurantSlide = false;
    }
  });
}

// FUNCTIONS: START-APP
function startApp() {
  start();
  navBarHandlers();
  clickAndSubmitHandlers();
}

$(startApp);
