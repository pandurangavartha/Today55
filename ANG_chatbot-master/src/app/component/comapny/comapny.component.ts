import { Component, OnInit } from '@angular/core';
import { CompanyService } from './company.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery: any;
import { PagerService } from '../users/pagerService'
import { Constant } from '../../app.constant';

@Component({
  selector: 'app-comapny',
  templateUrl: './comapny.component.html',
  styleUrls: ['./comapny.component.css']
})
export class ComapnyComponent implements OnInit {
  response = [];
  public role;
  showLoader = false;
  public companyList: any = [];
  public previous: any;
  public CompanyCount: number = 0;
  public company = { name: '', email: '' };
  private allItems: any[];
  public cmpylistUsers: any = [];
  private logeduserId: string;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  constructor(private router: Router, private route: ActivatedRoute,
    private companyservice: CompanyService, private pagerService: PagerService) { }

  ngOnInit() {
    this.getCompaniesList();
    this.role = localStorage.getItem('role');
    this.logeduserId = localStorage.getItem('id')
  }
  getCompaniesList(): void {
    if (localStorage.getItem('role') == 'ADMIN') {
      this.showLoader = true;
      this.companyservice.companyGetList().then(company => {
        if (company.status == 'success') {
          this.showLoader = false;
          let finalList = []
          company.result.forEach(element => {
            this.companyservice.getcompanyuserlist(element._id).then(response => {
              element.totalusers = (response.result.length - 1)
                element.createdAt = this.timeSince(element.createdAt)
              finalList.push(element)
            })
          });

          this.companyList = finalList;
          this.CompanyCount = company.result.length
          this.allItems = company.result;

          // initialize to page 1
          this.setPage(1);
        }
      })
    } else {
      this.showLoader = true;
      this.companyservice.userRelatedCompanies(localStorage.getItem('id')).then(company => {
        if (company.status == 'success') {
          this.showLoader = false;
          let data = []
          this.companyList = company.result;
          this.companyList.forEach(element => {
            if (element.company_id._id != 4) {
              data.push(element.company_id)
            }
          });
          this.companyList = data
          this.CompanyCount = data.length
         
          this.companyList.forEach(element => {
            this.companyservice.getcompanyuserlist(element._id).then(response => {
              element.totalusers = response.result.length
            })
            element.createdAt = this.timeSince(element.createdAt)
          });

          this.allItems = data;

          // initialize to page 1
          this.setPage(1);
        }
      })
    }
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.companyList = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  addCompany(company) {
    if (localStorage.getItem('role') == 'ADMIN') {
      company.user_id = localStorage.getItem('id')
      this.companyservice.addNewCompany(company).then(response => {
        if (response.status == 'success') {
          $('#name').val('')
          $('#email').val('')
          $('#name').parent().removeClass('has-success')
          $('#email').parent().removeClass('has-success')

          // this.company = { name: '', email: '' };
          $('#success-alert-company').css('z-index', '9999');
          $('#success-alert-company').fadeTo(2000, 500).slideUp(500, function () {
            $('#success-alert-company').slideUp(500);
            $('.alert').css('z-index', '-1000');
          });
          jQuery('#companyModal').modal('hide');
          this.getCompaniesList();
        }else{
         // some fields are missing
         $('.alert').css('z-index', '9999');
         $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
             $('#error-alert').slideDown(500);
             $('.alert').css('z-index', '-1000');
         });
        }
      });
    }
  }
  editCompany(id, company) {
    this.companyservice.UpdateCompany(id, company).then(response => {
      this.showLoader = false;

      $('.alert').css('z-index', '9999');
      $('#company-updated-alert').fadeTo(2000, 500).slideUp(500, function () {
        $('#company-updated-alert').slideUp(500);
        $('.alert').css('z-index', '-1000');
      });
    });
    company.pencil = false;
    company.hideinputbox = undefined;
    this.getCompaniesList();
  }

  openedit(x) {
    // console.log("-------open-----", x)
    this.companyList.forEach(element => {
      if (element._id === x._id) {
        element.hideinputbox = false;
        element.pencil = true;
      }
    });
  }

  private sendCancel($event: any): void {
  }

  private sendDelete($event: any, i): void {
    const index = this.response.indexOf(i);
    const body = { isDelete: true };
    this.companyservice.DeletedCompany(i).then(response => {
      // console.log("-------", response)
      this.companyList.splice(index, 1);
      this.showLoader = false;
      this.getCompaniesList();

      // console.log(i, 'index');
    });
    $('.alert').css('z-index', '9999');
    $('#error-alert-company-delete').fadeTo(2000, 500).slideUp(500, function () {
      $('#error-alert-company-delete').slideUp(500);
      $('.alert').css('z-index', '-1000');
    });
  }

  timeSince(prev) {
    this.previous = new Date(prev)
    let d = this.previous
    let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;

  }

}
