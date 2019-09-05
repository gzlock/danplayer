export class IconButton {
  $root: HTMLElement
  $use: SVGUseElement

  constructor ($div: HTMLElement) {
    this.$root = $div
    this.$use = this.$root.querySelector('use') as SVGUseElement
  }

  switch (iconAttr: string, titleAttr?: string) {
    this.switchIcon(iconAttr)
    if (titleAttr) this.switchTitle(titleAttr)
  }

  switchIcon (attributeName: string) {
    this.$use.setAttributeNS('http://www.w3.org/1999/xlink', 'href',
      '#' + this.$root.getAttribute(attributeName) as string)
  }

  switchTitle (attributeName: string) {
    this.$root.setAttribute('title', this.$root.getAttribute(attributeName) as string)
  }
}
