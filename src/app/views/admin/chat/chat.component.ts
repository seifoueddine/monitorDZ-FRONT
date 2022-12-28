import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
// import { ChatService, IChatContact, IChatConversation } from './chat.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { OpenAIApi } from 'openai';
import { Observable, Subject } from 'rxjs';
import { ChatService, IChatContact, IChatConversation } from 'src/app/shared/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;

  contacts: IChatContact[];
  conversations: IChatConversation[];
  currentUserId = 1;

  selectedConversation: IChatConversation;

  contacts$: Observable<IChatContact[]>;

  searchTerms = new Subject<string>();
  searchKeyword = '';
  message = '';
  urlForAvatar = environment.URL_PATH;
  staticPic = "/assets/img/avatar.png";
  user = JSON.parse(localStorage.getItem("user"));
  avatarUrl = localStorage.getItem("avatar");
  robotWrite = false;
  constructor(private openai: OpenAIApi, private chatService: ChatService, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'no-footer');
    this.getContacts();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'no-footer');
  }


  search(term: string): void {
    this.searchKeyword = term;
    this.searchTerms.next(term);
  }


  getContacts() {
    this.contacts = [{ id: 2, title: 'Je connais tout 😁', img: '/assets/img/logo-mm-black.png', date: 'Je suis toujours la' }]
    this.getConversations();
  }

  getConversations() {
    this.chatService.getConversations(this.currentUserId)
      .subscribe(conversations => {
        this.conversations = conversations;

        this.conversations =
          [{
            id: 2,
            lastMessageTime: this.getCurrentTime(),
            date: '5 minutes ago',
            messages: [{ sender: 2, time: this.getCurrentTime(), text: `Hello ${this.user.name}, Comment peux-je vous aider ?` }],
            users: [1, 2],
          }
          ]
        this.selectedConversation = this.conversations[0];
        this.changeDetectorRef.detectChanges();
        if (this.scrollRef) {
          this.scrollRef.directiveRef.scrollToBottom();
        }
      });
  }

  selectConversation(conversationId: number) {
    this.selectedConversation = this.conversations.find(x => x.id === conversationId);
    if (this.scrollRef) {
      setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
    }
  }


  getOtherUser(users: number[]): IChatContact {
    const otherId = users.find(x => x !== this.currentUserId);
    return this.contacts.find(x => x.id === otherId);
  }
  getUser(id: number): IChatContact {
    if (id === this.currentUserId) {
      return {
        id,
        title: 'Me',
        img: this.avatarUrl ? (this.urlForAvatar + this.user.avatar.url) : this.staticPic,
        date: '5 minutes ago'
      };
    }
    return this.contacts.find(x => x.id === id);
  }

  sendMessage() {
    console.log(    this.openai.listModels({ headers: { 'Authorization': `Bearer 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` } }));
 
    if (this.message.length > 0) {
      this.robotWrite = true;
      const time = this.getCurrentTime();
      this.selectedConversation.messages.push({ sender: this.currentUserId, text: this.message, time });
      this.selectedConversation.lastMessageTime = time;

      this.openai.createCompletion({ model: 'text-davinci-003', prompt: this.message, max_tokens: 3500, }, { headers: { 'Authorization': `Bearer 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` } }).then((response) => {
        let respons = response?.data?.choices[0]?.text.replace(/^\n\n/, '').replace(/\n/g, '<br>');
        const time_response = this.getCurrentTime();
        this.robotWrite = false;
        this.selectedConversation.messages.push({ sender: 2, text: respons, time });
        if (this.scrollRef) {
          setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
        }
      });
      if (this.scrollRef) {
        setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
      }
      this.message = '';
    }
  }

  messageInputKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') { this.sendMessage(); }
  }

  getCurrentTime(): string {
    const now = new Date();
    return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
  }

  pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
}
