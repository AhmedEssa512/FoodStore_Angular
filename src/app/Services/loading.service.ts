import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
 private requestCount = 0;
  constructor(private spinner:NgxSpinnerService) { }

  show()
  {
    this.requestCount++;
    if(this.requestCount === 1)
    {
      this.spinner.show(undefined,{
        bdColor : "rgba(0, 0, 0, 0.8)",
        size : "large",
        color : "#fff",
        type : "square-jelly-box",
        fullScreen : true
      })
    }
  }

  hide()
  {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.spinner.hide();
    }else if(this.requestCount < 0){
      this.requestCount = 0;
    }
    
  }
}
