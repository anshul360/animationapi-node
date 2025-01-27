# AnimationAPI Node.js Library

A Node.js wrapper for the AnimationAPI API - an animation, video and image generation service.

## Documentation

Find the full API documentation [here](https://developers.AnimationAPI.com/)

## Requirements

Node 18 or higher.

## Installation

Install the package with:

```sh
npm install --save animationapi
# or
pnpm add animationapi
# or
yarn add animationapi
# or
bun animationapi
```

## Usage

### Table of Contents

- [Import](#import)
- [Authentication](#authentication)
- [Account Info](#account-info)
- [Animations](#animations)
- [Videos](#videos)
- [Images](#images)
- [Signed URLs](#signed-urls)

### Import
In Javascript
```js
const { AnimationAPI } = require('animationapi')
```

And in typescript
```ts
import AnimationAPI from 'animationapi';
```

### Authentication

Get the API key for your organization or project from AnimationAPI app and then instantiate a new client.

```ts
const aa = new AnimationAPI("your api key");
```

Alternatively, set the API key in an environment variable named `ANIMATIONAPI_API_KEY`.

```ts
const aa = new AnimationAPI();
```

### Usage with TypeScript

```ts
import AnimationAPI from "animationapi";
const aa = new AnimationAPI("your api key");

const createAnimation = async () => {
  const params: AnimationAPI.CreateAnimationParams = {
    metadata: [],
  };

  const image = await aa.create_animation("template uid", params);
};

createAnimation();
```

### Account Info

Return info about the organization or project associated with the API key.

```ts
const account = await aa.account();
```

### Videos

#### Create a Video

```ts
await aa.create_video("video template uid", {
  input_media_url: "https://www.yourserver.com/videos/awesome_video.mp4",
  modifications: [
    {
      name: "headline",
      text: "Hello world",
    },
  ],
});
```

##### Options

- `input_media_url`: a url to a publicly available video file you want to import (string)
- `modifications`: an array of modifications you would like to make to the video overlay (array)
- `webhook_url`: a webhook url to post the final video object to (string)
- `blur`: blur the imported video from 1-10 (integer)
- `trim_to_length_in_seconds`: trim the video to a specific length (integer)
- `create_gif_preview`: create a short preview gif (boolean)
- `metadata`: include any metadata to reference at a later point (string)

If your video is using the "Multi Overlay" build pack then you can pass in a set of frames to render via:

- `frames`: an array of sets of modifications (array)
- `frame_durations`: specify the duration of each frame (array)

#### Get a video

```ts
await aa.get_video("video uid");
```

#### Update a Video

```ts
await aa.update_video("video uid", {
  approved: true,
  transcription: [
    "This is a new transcription",
    "It must contain the same number of lines",
    "As the previous transcription",
  ],
});
```

##### Options

- `approved`: approve the video for rendering (boolean)
- `transcription`: an array of strings to represent the new transcription (will overwrite the existing one) (array)

#### List all Videos

```ts
await aa.list_videos();
```

##### Options

- `page`: pagination (`integer`)

### Images

#### Create an Image

To create an image you reference a template uid and a list of modifications. The default is async generation meaning the API will respond with a `pending` status and you can use `get_image` to retrieve the final image.

```ts
const images = await aa.create_image("template uid", {
  modifications: [
    {
      name: "headline",
      text: "Hello world!",
    },
    {
      name: "photo",
      image_url:
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1000&q=80",
    },
  ],
});
```

You can also create images synchronously - this will take longer to respond but the image will be delivered in the response:

```ts
const images = await aa.create_image(
  "template uid",
  {
    modifications: [
      {
        name: "headline",
        text: "Hello world!",
      },
      {
        name: "photo",
        image_url:
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1000&q=80",
      },
    ],
  },
  true
);
```

##### Options

- `modifications`: an array of [modifications](https://developers.AnimationAPI.com/#post-v2-images) you would like to make (`array`)
- `webhook_url`: a webhook url to post the final image object to (`string`)
- `transparent`: render image with a transparent background (`boolean`)
- `synchronous`: generate the image synchronously (`boolean`)
- `render_pdf`: render a PDF in addition to an image (`boolean`)
- `metadata`: include any metadata to reference at a later point (`string`)

#### Get an Image

```ts
await aa.get_image("image uid");
```

#### List all images

```ts
await aa.list_images();
```

Optionally you can provide a page and limit

```ts
await aa.list_images(10, 25);
```

### Signed URLs

This gem also includes a convenient utility for generating signed urls. Authenticate as above, then:

```ts
await aa.generate_signed_url("base uid", { modifications: [] });

// example
await aa.generate_signed_url("A89wavQyY3Bebk3djP", {
  modifications: [
    {
      name: "country",
      text: "testing!",
    },
    {
      name: "photo",
      image_url:
        "https://images.unsplash.com/photo-1638356435991-4c79b00ebef3?w=764&q=80",
    },
  ],
});
// => https://ondemand.AnimationAPI.com/signedurl/A89wavQyY3Bebk3djP/image.jpg?modifications=W3sibmFtZSI6ImNvdW50cnkiLCJ0ZXh0IjoidGVzdGluZyEifSx7Im5hbWUiOiJwaG90byIsImltYWdlX3VybCI6Imh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjM4MzU2NDM1OTkxLTRjNzliMDBlYmVmMz93PTc2NCZxPTgwIn1d&s=40e7c9d4902b86ea83e0c400e57d7cc580534fd527e234d40a0c7ace589a16eb
```

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
