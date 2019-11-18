# Markdown Example

## Tables

| Tables        | Multi         | Col   |
| ------------- |:-------------:| -----:|
| col 1 is      | left-aligned  |   $12 |
| col 2 is      | centered      |   $12 |
| col 3 is      | right-aligned | $1600 |
| zebra stripes | on even rows  |    $1 |
| <ul><li>Item 1</li><li>Item 2</li></ul>| List example | $1234.45 |


There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3


## Quoting

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.


## Task Lists

### Simple task list

- [x] Example completed task
- [ ] Example incomplete task
- [ ] Another incomplete task

### Nested task list

- [x] Task 1
  - [ ] Task 1.1
  - [x] Task 1.2 complete
  - Not a task
  - This is also not a task
  - [x] Task 1.3 complete
  - [ ] Task 1.4
- [ ] Task 2
- [ ] Task 3


### Numbered task list

1. [ ] Task 1
2. [ ] Task 2
3. [x] Task 3


## Images

Inline-style:
![alt text](mocks/api-dev/needle/v1/assets/Hong-Kong-Foei.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: mocks/api-dev/needle/v1/assets/Hong-Kong-Foei.png "Logo Title Text 2"


## Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).


## Lists

1. First ordered list item
2. Another item
  * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.
   Note that this line is separate, but within the same paragraph.
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses
+ Another
+ [ ] Task
+ [x] Task complete
+ End


## Styling

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~


## Headers

# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------


## Code

Inline `code` has `back-ticks around` it.


```
var s = "Some code";
alert(s);
```


```javascript
// Javascript example
var s = "Some code";
alert(s);
```


```js
// Javascript example with alias
var s = "Some code";
alert(s);
```


```js
// Javascript example with JSX
import React from "react";

export default function() {
    return (
        <section className="component__metadata">
            {this.getPlugin()}
        </section>
    );
}
```


```jsp
// Java example with alias
import java.util.*;
/**
 * Some comment
 */
public class MyClass {
    private static final String test = Test.getSomeValue(Other.class);
}
```


```php
// PHP example
class Test {
   var $edible;
   var $color;

   function __construct($edible, $color="green")
   {
       $this->edible = $edible;
       $this->color = $color;
   }
}
```


```css
/* CSS example */
.my-class {
    border: 1px solid #ff0000;
    border: 1px solid green;
    border: yellow 1px solid;
    margin: 20px 10px;
    top: 0;
}
```


```markdown
## Markdown example
Inline-style:
![alt text](mocks/api-dev/needle/v1/assets/Hong-Kong-Foei.png "Logo Title Text 1")
```


```xml
<!-- XML example -->
<doc>
    <item attr1="val 1" attr2="val 2">Text item 1</item>
    <item attr1="val 1" attr2="val 2"/>
</doc>
```


```html
<!doctype html>
<html lang="en">
<head>
    <title>HTML Example</title>
    <link href="styles.css"/>
    <style>
        .test {
            border: 1px solid #ff0000;
            border: 1px solid green;
            border: 1px orange solid;
            border: 1px solid rgb(0, 255, 0);
            border: 1px solid rgba(0, 255, 0, 0.5);
            background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
            margin: 0;
        }
    </style>
    <script type="text/javascript" src="script.js"></script>
    <script type="text/javascript">
        // Javascript example
        var s = "Some code";
        alert(s);
        var a = {
            test: function(a, b, c) {
                console.error(a, b, c);
            }
        };
        var b = a.test("a", 42, true);
    </script>
</head>
<body>
    <!-- Body content goes here... -->
</body>
</html>
```

## HTML (example with definition lists)

<dl>
  <dt>Label</dt>
  <dd>Value</dd>
  <dt>Label 2</dt>
  <dd>Value 2</dd>
  <dt>Label 3</dt>
  <dd>Value 3</dd>
</dl>

### Sanitisation

<a href="javascript:alert(42)">Link with sanitised javascript in href</a>

Script block removed:
[<script type="text/javascript">
alert(42);
</script>]

## Horizontal lines

Three or more...

### Hyphens

---

### Asterisks

***

### Underscores

___


