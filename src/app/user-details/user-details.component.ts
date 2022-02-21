import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { userDetails } from '../global-model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  login;
  userDetail;
  repoDetails;

  constructor(private activeRoute: ActivatedRoute, private api: ApiService, private location: Location) { }

  ngOnInit(): void {
    this.login = this.activeRoute.snapshot.paramMap.get('login');
    console.log(this.login);
    this.getUserDetails();
  }

  getUserDetails() {
    this.api.userDetails(this.login).subscribe({
      next: (res: userDetails) => {
        console.log(res);
        this.userDetail = res;
        this.getRepoDetails(res.repos_url);
      }
    });
  }

  getRepoDetails(url) {

    this.api.repoDetails(url).subscribe({
      next: (res) => {
        this.repoDetails = res;

      }
    });

  }

}
