import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-addjob',
  templateUrl: './addjob.component.html',
  styleUrls: ['./addjob.component.css']
})
export class AddjobComponent {
  jobForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      postId: ['', Validators.required],
      postProfile: ['', Validators.required],
      postDesc: ['', Validators.required],
      reqExperience: [0, [Validators.required, Validators.min(0)]],
      postTechStack: this.fb.array([this.fb.control('')])
    });
  }

  get postTechStack(): FormArray {
    return this.jobForm.get('postTechStack') as FormArray;
  }

  addTech(): void {
    this.postTechStack.push(this.fb.control(''));
  }

  removeTech(index: number): void {
    this.postTechStack.removeAt(index);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitForm(): void {
    if (this.jobForm.valid && this.selectedFile) {
      const jobData = {
        ...this.jobForm.value
      };

      const formData = new FormData();
      formData.append('jobPost', new Blob([JSON.stringify(jobData)], { type: 'application/json' }));
      formData.append('image', this.selectedFile);

      this.jobService.createJob(formData).subscribe({
        next: (response) => {
          console.log('Job created:', response);
          this.jobForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error submitting job:', error);
        }
      });
    } else {
      console.error('Form is invalid or image not selected');
    }
  }
  

}
