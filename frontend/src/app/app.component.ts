
import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterOutlet }    from '@angular/router';  
import { CommonModule }    from '@angular/common';    
import { LoadingService }  from './services/loading.service';
import { Subscription }    from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,                                   
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,                                        
    RouterOutlet
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  isLoading = false;
  private sub = new Subscription();

  constructor(
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.sub.add(
      this.loadingService.isLoading$.subscribe(v => {
        this.isLoading = v;
        this.cd.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
