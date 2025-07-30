# Custom Error Pages


In this example we use a CDN application with [Handlebars](https://docs.rs/handlebars/latest/handlebars/index.html) as a template engine to generate custom error pages.


There is only a single template [error_page.hbs](./templates/error_page.hbs) used for all our custom pages. We only customize the layout with variables injected based on `response.status`.


### Compile-time

This application uses a [build script](./build.rs) that runs during compile time to generate the various options for each status code.

( This happens at build time as we have no file system during runtime. )

This build script loops through the contents of the public folder. i.e. `./public/images` & `./public/messages` and maps their values into a HashMap for access during runtime.


### Runtime

When the application runs, if a matching image or message file is found it will use its content, else fallback to the `4xx` or `5xx` version if they are present.


## Adding another custom response

In order to handle another custom error page, all that needs adding is content to the `/public` folder. Followed by re-compiling and deploying.

e.g.

1) Add a new image `./public/images/418.jpg`
2) Add a new message `./public/messages/418.hbs`

  ```hbs
  I'm a Teapot!!
  The server refuses to brew coffee because it is, permanently, a teapot.
  ```

After compiling and deploying the applicaiton will now also handle any `418` responses with a custom page.
