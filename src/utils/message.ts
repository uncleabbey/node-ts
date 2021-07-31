export const htmlMessage = (name: string, address: string): string =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mail From UncleAbbey</title>
      <style>
          .verify {
              padding: 1em 3em;
              border: 0;
              outline: 0;
              background: green;
              color: aliceblue;
              font-weight: bolder;
          }
          body {
              text-align: center;
          }
          
      </style>
  </head>
  <body>
      <h3>Welcome to Uncleabbey Blog ${name}</h3>
      <div>
          <p>We are happy to have you share your thoughts on our blog, We hope that you enjoy putting your thought into words. let  us do this, but before then we need a little help from you. Please click <a href="${address}" target="_blank">here</a> to confirm your account</p>
          <p>Or you can click on the button below</p>
          <p><a href="${address}"><button class="verify">Verify Account</button></a></p>
      </div>
  </body>
  </html>
    `;

export const textMessage = (name: string, address: string): string =>
  `
    Welcome to Uncleabbey Blog ${name}
    We are happy to have you share your thoughts on our blog, We hope that you enjoy putting your thought into words. let  us do this, but before then we need a little help from you. Click on ${address} to confiem your account
    `;
