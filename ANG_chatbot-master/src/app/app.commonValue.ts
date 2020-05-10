
import { Injectable, EventEmitter, Pipe, PipeTransform } from '@angular/core';

@Injectable()
export class Getseleteddata {
    getDisplayName = new EventEmitter<any>();
}
export class Bannneddata {
    bannneddata1 = new EventEmitter<any>();
}

export class Chatroutering {
    chatroutering = new EventEmitter<any>();
}

@Pipe({
    name: 'limitTo'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string, limit: number): string {

        const trail = '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}

@Pipe({ name: 'secondsToTime' })
export class SecondsToTimePipe implements PipeTransform {

    transform(timer, getdetailsoflist2, key) {
        const hours = Math.floor(timer / 3600) < 10 ? ("00" + Math.floor(timer / 3600)).slice(-2) : Math.floor(timer / 3600);
        const minutes = ("00" + Math.floor((timer % 3600) / 60)).slice(-2);
        const seconds = ("00" + (timer % 3600) % 60).slice(-2);
        // console.log('------------', key)
        if (hours === '03' && minutes === '00' && seconds === '00') {
            getdetailsoflist2(key);
        }
        return hours + ":" + minutes + ":" + seconds;
    }


    // ngOnDestroy() {
    //     console.log("---Destroy timer----");
    //     // unsubscribe here
    //     // this.sub.unsubscribe();

    // }
}





