import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-editjobs',
  templateUrl: './editjobs.component.html',
  styleUrls: ['./editjobs.component.css']
})
export class EditjobsComponent {
  jobForm: FormGroup;
  postId: string = '';
  selectedFile: File | null = null;
  isUpdating = false;
  previousImageUrl: string | ArrayBuffer | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private jobService: JobService
  ) {
    this.jobForm = this.fb.group({
      postId: ['', Validators.required],
      postProfile: ['', Validators.required],
      postDesc: ['', Validators.required],
      reqExperience: ['', [Validators.required, Validators.min(0)]],
      postTechStack: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('postId')!;
    this.loadJobData();
  }

  get postTechStack() {
    return this.jobForm.get('postTechStack') as FormArray;
  }

  addTech(tech: string = '') {
    // if (tech.trim()) {
      this.postTechStack.push(this.fb.control(''));
    // }
  }

  removeTech(index: number) {
    this.postTechStack.removeAt(index);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Only image files are allowed');
        return;
      }
      this.selectedFile = file;
      
      // Create preview for new image
      const reader = new FileReader();
      reader.onload = () => {
        this.newImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadJobData() {
    this.jobService.getJobById(this.postId).subscribe({
      next: (job) => {
        // ... existing form population code

        console.log('Received job data:', job);

        while (this.postTechStack.length !== 0) {
          this.postTechStack.removeAt(0);
        }

        this.jobForm.patchValue({
          postId: job.postId,
          postProfile: job.postProfile,
          postDesc: job.postDesc,
          reqExperience: job.reqExperience
        });

        // if (job.postTechStack &&  job.postTechStack?.length > 0) {
        //   job.postTechStack.forEach((tech) => this.addTech(tech));
        // }
        if (job.postTechStack?.length > 0) {
          job.postTechStack.forEach(tech => {
            this.postTechStack.push(this.fb.control(tech));
          });
        }

        // Load previous image if available
        if (job.imageName) {
          this.jobService.getJobImage(job.postId).subscribe({
            next: (imageBlob) => {
              this.createImageFromBlob(imageBlob, 'previous');
            },
            error: (err) => {
              console.error('Error loading previous image:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading job:', err);
      }
    });
  }

  // loadJobData() {
  //   this.jobService.getJobById(this.postId).subscribe({
  //     next: (job) => {
  //       // Clear existing tech stack
  //       while (this.postTechStack.length !== 0) {
  //         this.postTechStack.removeAt(0);
  //       }

  //       // Patch form values
  //       this.jobForm.patchValue({
  //         postId: job.postId,
  //         postProfile: job.postProfile,
  //         postDesc: job.postDesc,
  //         reqExperience: job.reqExperience
  //       });

  //       // Add tech stack items
  //       if (job.postTechStack && job.postTechStack.length > 0) {
  //         job.postTechStack.forEach(tech => this.addTech(tech));
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading job:', err);
  //     }
  //   });
  // }

  private createImageFromBlob(blob: Blob, type: 'previous' | 'new') {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'previous') {
        this.previousImageUrl = reader.result;
      } else {
        this.newImagePreview = reader.result;
      }
    };
    reader.readAsDataURL(blob);
  }

  submitForm() {
    if (this.jobForm.valid && this.selectedFile) {
      this.isUpdating = true;
      
      const jobPostData = {
        ...this.jobForm.value
        //postTechStack: this.jobForm.value.postTechStack
      };

      const formData = new FormData();
      formData.append('jobPost', new Blob([JSON.stringify(jobPostData)], { type: 'application/json' }));
      formData.append('image', this.selectedFile);

      this.jobService.updateJob(formData).subscribe({
        next: (updatedJob) => {
          this.isUpdating = false;
          alert('Job updated successfully!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isUpdating = false;
          console.error('Error updating job:', err);
          alert('Error updating job. Please try again.');
        }
      });
    } else {
      alert('Please select an image and fill all required fields');
    }
  }

}
