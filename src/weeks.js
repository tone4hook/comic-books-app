// Weeks class

// class handles weeks for new comics releases
class Weeks {

    constructor(date) {

        this._date = new Date(date);
        this._weekday = this._date.getDay();
        this._weeks = [];

    } // /constructor

    setWeeks() {

        // set date a week ahead
        this._date.setDate( this._date.getDate() + 7 );
        // set date to that week's Monday
        this._date.setDate( this._date.getDate() - ( this._weekday - 1 ) );
        // generate weeks with start and end date
        // for Comic Vine API filter
        this.generate();

    } // /setweeks

    getWeeks() {

        // move the current week
        // to the front of the array
        this._weeks.move( 1, 0 );

        return this._weeks;

    } // /getweeks

    generate() {

        let i = 0; // counter

        // generate a start date and end date
        // that begins one week ahead of current week
        // 8 weeks total
        while (i < 8) {

            let start = new Date( this._date.getTime() );

            // end date is that week's Friday
            this._date.setDate( this._date.getDate() + 4 );

            let end = new Date( this._date.getTime() );
            // date Object with date format for API
            let days = {
                start: start.toISOString().substring(0, 10),
                end: end.toISOString().substring(0, 10)
            } // /days

            this._weeks.push( days ); // add to weeks array

            // move back to the previous Monday
            this._date.setDate( this._date.getDate() - 11 );

            i++;

        } // /while

    } // /generate

}

export default Weeks;

// https://stackoverflow.com/questions/5306680/
// move-an-array-element-from-one-array-position-to-another
//
Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};