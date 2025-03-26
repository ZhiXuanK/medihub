import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refresh',
  standalone: false,
  templateUrl: './refresh.component.html',
  styleUrl: './refresh.component.css'
})
export class RefreshComponent implements OnInit{

  private router = inject(Router)

  ngOnInit(): void {
    this.router.navigate(['/dashboard'])
  }
}
