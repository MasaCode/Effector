## Effector
#### Simple non jquery effects template
## Installation
#### Step 1 : Download file and link required files
First, you need to download effector.js from this site.
Next, link javascript file.
```HTML
<script src="common/js/effector.js"></script>
```
#### Step2 : Create HTML Markup (Sample)
```HTML
<h2 id="title">Test</h2>
<div>
   <p class="parag">
       Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
       industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
       scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
       electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
       Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
       Aldus PageMaker including versions of Lorem Ipsum.
   </p>
</div>
```
#### Step3 : Create Effector instance
```Javascript
var effector = new Effector({
    elements : [
        {
            selector : '#title',
            func : 'bounce',
            showTogether : true,
            from : ['bottomright'],
        },
        {
            selector : '.parag',
            func : 'fadein',
            showTogether : true,
        }
    ],
    delay : 1000,
});
```
## Configuration options
#### **delay** Delay until effects start (seconds)
```Javascript
delay : 0
delay : 1000
```
#### **elements** An array of element information
**selector** An ID or Class of DOM element
```Javascript
selector : '#id'
selector : '.class'
```
**func** Name of effect function
```Javascript
func : 'Sldiein'
func : 'fadeIn'
```
**showTogether** Boolean variable to set if you want to effects at same time (if selected element is more than one)
```Javascript
showTogether : true
showTogether : false
```
**useCustomDirection** A boolean variable to set if the program use custome direction
```Javascript
useCustomeDirection : true
useCustomeDirection : false
```
**from** An array of direction (string or integer 1 - 100)
```Javascript
from : ['center', 'topleft']
from : [100, 0]
```
**to** An array of direction (default is element's position, only use this when you set useCustomDirection true)
```Javascript
to : [100, 0]
```
#####Sample
```Javascript
elements : [
    {
        selector : '#title',
        func : 'bounce',
        showTogether : true,
        from : ['bottomright'],
    },
]
```
