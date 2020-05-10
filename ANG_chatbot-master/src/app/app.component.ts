import { Component, OnInit, Input, AfterViewInit, ElementRef, Renderer2, ViewChild, Injectable, EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot, Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
// import './utils/dataTables.extensions';
import * as io from 'socket.io-client';
import { Constant } from './app.constant';
declare var jquery: any;
declare var $: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    url: string;
    haha: any;
    windHeight: any;
    currentUrl: '';
    location: any;
    showDashboard = true;
    socket: SocketIOClient.Socket;
    @Input() authentication: boolean;
    // showLoader: boolean;

    constructor(private element: ElementRef, private router: Router) {
        this.router.events.subscribe((event) => {
            if (localStorage.getItem('istyping') === null) {
                const set: any = [];
                localStorage.setItem('istyping', set);
            }
            // $('.content-wrapper').css('margin-left', '433px')
            const heth = $(window).height() - 80;
            $('.setheight').height(heth);
            $(window).height();
            if (this.router.url === '/login' || this.router.url.indexOf('register') !== -1 ||
                this.router.url.indexOf('forgotpassword') !== -1) {
                this.showDashboard = false;
            } else {
                this.showDashboard = true;
            }
        });
        this.haha = this.element.nativeElement;
        this.haha.style.height = '100%';
        this.windHeight = (window.screen.height) + 'px';
        setTimeout(() => {
            const currentUrl = window.location.href;
        }, 100);

        router.events.subscribe((val) => {
            setTimeout(function () {
                // Remove overflow from .wrapper if layout-boxed exists
                $('.layout-boxed > .wrapper').css('overflow', 'hidden');
                // Get window height and the wrapper height
                const footer_height = $('.main-footer').outerHeight() || 0;
                const neg = $('.main-header').outerHeight() + footer_height;
                const window_height = $(window).height();
                const sidebar_height = $('.sidebar').height() || 0;
                // Set the min-height of the content and sidebar based on the
                // the height of the document.
                if ($('body').hasClass('fixed')) {
                    $('.content-wrapper, .right-side').css('min-height', window_height - footer_height);
                } else {
                    let postSetWidth;
                    if (window_height >= sidebar_height) {
                        $('.content-wrapper, .right-side').css('min-height', window_height - neg);
                        postSetWidth = window_height - neg;
                    } else {
                        $('.content-wrapper, .right-side').css('min-height', sidebar_height);
                        postSetWidth = sidebar_height;
                    }
                    // Fix for the control sidebar height
                    const controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
                    if (typeof controlSidebar !== 'undefined') {
                        if (controlSidebar.height() > postSetWidth) {
                            $('.content-wrapper, .right-side').css('min-height', controlSidebar.height());
                        }
                    }
                }
            }, 10);
        });
        this.socket = io.connect(Constant.url);

    }
    ngOnInit() {
        if (Notification['permission'] !== "granted") {
            console.log('raju')
            Notification.requestPermission();
        }

        this.socket.on('EmitMessageTorecevr', (msg: any) => {
            if (Notification['permission'] !== "granted")
                Notification.requestPermission();
            else {
                if(msg.type === 'group'){
                    if (msg.user_id != localStorage.getItem('id')) {
                        var notification = new Notification('Teamwork chat', {
                            icon: 'assets/images/ang.png',
                            body: msg.messageText,
                        });
                        notification.onclick = function () {
                            // window.open("lohttp://stackoverflow.com/a/13328397/1269037");
                        };
                    }
                }else{
                    if (msg.recer_id == localStorage.getItem('id')) {
                        var notification = new Notification('Teamwork chat', {
                            icon: 'assets/images/ang.png',
                            body: msg.messageText,
                        });
                        notification.onclick = function () {
                            // window.open("lohttp://stackoverflow.com/a/13328397/1269037");
                        };
                    } 
                }
            }
        })

        this.socket.on('userLoggedOutMultipleAccountsDelete', (msg: any) => {
            if (localStorage.getItem('id') == msg) {
                localStorage.removeItem('auth');
                localStorage.setItem('istyping', '');
                localStorage.removeItem('id');
                localStorage.removeItem('userinfo');
                localStorage.removeItem('role');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.removeItem('email');
                localStorage.removeItem('firstName');
                localStorage.removeItem('lastName');
                localStorage.removeItem('displayName');
                localStorage.removeItem('online');
                this.router.navigate(['/login']);
            }
        });
    }


}



