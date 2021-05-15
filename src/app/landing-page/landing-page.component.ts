import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faGlobe, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

interface faqQuestion {
  question: string,
  answer: Array<string>,
  active: boolean
}
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerWidth < 951 ? this.mobile = true : this.mobile = false;
  }
  constructor(private router: Router) { }
  @ViewChild('video1', {static: true}) video1: ElementRef;
  @ViewChild('video2', {static: true}) video2: ElementRef;
  @ViewChild('emailInputTop', {static: true}) emailTop: ElementRef;
  @ViewChild('emailInputBottom', {static: true}) emailBottom: ElementRef;
  faGlobe = faGlobe
  faChevronRight = faChevronRight;
  innerWidth;
  mobile: boolean;
  topInputElementEntered:boolean = false;
  topInputElementValid:boolean = false;
  bottomInputElementEntered:boolean = false;
  bottomInputElementEnteredValid:boolean = false;
  errorMsg:string;
  signUpEmail = new Subject<{email:string}>();
  
  faq: Array<faqQuestion>
  ngOnInit(): void {
    this.innerWidth = window.innerWidth
    this.innerWidth < 951 ? this.mobile = true : this.mobile = false;
    this.faq = [
      {
        question: 'What is Netflix?',
        answer: [
          `Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.`,
          `You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!`,
        ],
        active: false
      },
      {
        question: 'How much does Netflix cost?',
        answer: [
          'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $9.99 to $18.99 a month. No extra costs, no contracts.',
        ],
        active: false
      },
      {
        question: 'Where can I watch?',
        answer: [
          `Watch anywhere, anytime, on an unlimited number of devices. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.`,
          `You can also download your favorite shows with the iOS, Android, or Windows 10 app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.`,
        ], 
        active: false
      },
      {
        question: 'How do I cancel?',
        answer: [
          `Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.`,
        ],
        active: false
      },
      {
        question: 'What can I wacth on Netflix?',
        answer: [
          `Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.`,
        ],
        active: false
      },
    ]
  }

  ngAfterViewInit(): void {
    this.video2.nativeElement.muted = true;
    this.video2.nativeElement.play();
    this.video1.nativeElement.muted = true;
    this.video1.nativeElement.play();
  }

  onTopSubmit() {
    if(this.topInputElementValid){
      console.log('top');
      this.signUpEmail.next({email: this.emailTop.nativeElement.value})
      this.router.navigate(['signup']);
    }  
  }
  onBottomSubmit() {
    if(this.bottomInputElementEnteredValid){
      console.log('bottom');
      this.signUpEmail.next({email: this.emailBottom.nativeElement.value})
      this.router.navigate(['signup']);
    }  
  }
  onInputTopFocusOut(){
    if(!this.topInputElementEntered && !!this.emailTop.nativeElement.value)
      this.topInputElementEntered = true;
    
  }

  inputTopKeyDown(e){
    if(e.key === 'Enter'){
      this.topInputElementEntered = true;
      this.onTopSubmit();
      return;
    }
    this.topInputElementValid = this.validateEmail(this.emailTop.nativeElement.value);
    if(this.emailTop.nativeElement.value === '')
      this.errorMsg = 'Email is required!'
    else if(!this.topInputElementValid)
      this.errorMsg = 'Please enter a valid email'
  }

  onInputBottomFocusOut(){
    if(!this.bottomInputElementEntered && !!this.emailBottom.nativeElement.value)
      this.bottomInputElementEntered = true;
    
  }
  inputBottomKeyDown(e){
    if(e.key === 'Enter'){
      this.bottomInputElementEntered = true;
      this.onBottomSubmit();
      return;
    }
    this.bottomInputElementEnteredValid = this.validateEmail(this.emailBottom.nativeElement.value);
    if(this.emailBottom.nativeElement.value === '')
      this.errorMsg = 'Email is required!'
    else if(!this.bottomInputElementEnteredValid)
      this.errorMsg = 'Please enter a valid email'
  }

  validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onAccordianClick(index:number){
    let pannel = document.getElementById('panel-'+index);
    if(this.faq[index].active)
      pannel.style.maxHeight = null;
    else {
      pannel.style.maxHeight = pannel.scrollHeight + 'px';
      this.faq.forEach((question, i) => {
        if(question.active){
          let pannelToClose = document.getElementById('panel-'+i);
          pannelToClose.style.maxHeight = null;
          question.active = false;
        }
      })
    }
    
      this.faq[index].active = !this.faq[index].active;
  }

}
 