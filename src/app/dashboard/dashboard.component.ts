import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from '../api.service';
import { SearchOtption } from '../global-model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  searchGroup: FormGroup;
  subject: Subject<any> = new Subject();

  serachKey = '';
  searchOptions = [];
  selectedId = 0;
  searchResult = [];
  recentSearh = [];
  recentSearhFilter = null;

  constructor(private api: ApiService, private route: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (localStorage.getItem('recentSearch')) {
      console.log('yes');
      this.recentSearh = JSON.parse(localStorage.getItem('recentSearch'));
    }

    this.searchGroup = this.formBuilder.group({
      search: ['']
    });

    this.subject
      .pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.api.searchUser(this.serachKey).subscribe({
          next: (res: SearchOtption) => {
            if (!res.incomplete_results) {
              const recentSearhFilter = [];
              this.recentSearh.filter((val: string) => {
                return val.includes(this.serachKey.toLowerCase());
              }).forEach((val, index) => {
                recentSearhFilter.push({login: val, avatar_url: './assets/images/history.png', id: 'history' + index});
              });
              this.searchOptions = [ ...recentSearhFilter, ...res.items.slice(0, 5)];
              this.searchOptions.unshift({ login: '' });
            } else {
              this.searchOptions = [];
            }
          },
          error: () => {

          }
        });
      }
      );

  }

  ngAfterViewInit(): void {
      let search = document.getElementById('search');
      search.addEventListener('focus', () => {
        document.getElementById('searchOptions') ? document.getElementById('searchOptions').style.display = "block" : '';
      });
      search.addEventListener('blur', () => {
        document.getElementById('searchOptions') ? setTimeout( ()=>{document.getElementById('searchOptions').style.display = "none"},100) : '';
      });
  }

  filter(event) {
    if (event.code === 'ArrowUp') {
      if (this.selectedId != 0) {
        this.selectedId -= 1;
        this.serachKey = this.searchOptions[this.selectedId].login;
      }
    } else if (event.code === 'ArrowDown') {
      if (this.searchOptions.length - 1 > this.selectedId) {
        this.selectedId += 1;
        this.serachKey = this.searchOptions[this.selectedId].login;
      }
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
      this.serachKey = event.target.value;
      this.subject.next();
    }

  }

  search(val: string) {
    this.serachKey = val;
    console.log(this.serachKey);


    this.api.searchUser(this.serachKey).subscribe({
      next: (res: SearchOtption) => {
        if (!res.incomplete_results) {
          this.searchOptions = [];
          if (res.items.length > 0) {
            this.recentSearh.unshift(this.serachKey.toLowerCase());
            this.recentSearh = [...new Set(this.recentSearh)];
            console.log(this.recentSearh);
            localStorage.setItem('recentSearch', JSON.stringify(this.recentSearh));
            this.searchResult = res.items;
          }
        } else {
          this.searchResult = [];
          this.searchOptions = [];
        }
      },
      error: () => {

      }
    });
  }

  selectUser(login) {
    this.route.navigate(['/userDetails/' + login]);
  }

  removeSearch(item) {
    console.log(item);

    const index = this.recentSearh.findIndex((val) => val == item);
    console.log(index);

    const x = this.recentSearh.splice(index, 1);
    console.log(x);

    this.recentSearh = [...new Set(this.recentSearh)];
    localStorage.setItem('recentSearch', JSON.stringify(this.recentSearh));
  }
}
