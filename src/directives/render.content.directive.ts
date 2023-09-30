import { Directive, Input, TemplateRef, ViewContainerRef, SecurityContext, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[contentRenderer]'
})
export class ContentRendererDirective {

  @Input() set contentRenderer(content: string | TemplateRef<any> | null) {
    this.viewContainerRef.clear();
    if (typeof content === 'string') {
      const sanitizedHtmlString = this.sanitizer.sanitize(SecurityContext.HTML, content);
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', sanitizedHtmlString);
    } else if (content instanceof TemplateRef) {
      this.viewContainerRef.createEmbeddedView(content);
    }
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { }
}
