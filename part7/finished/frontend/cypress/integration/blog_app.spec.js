// dosn't need import cy

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      username: 'john1995test',
      name: 'John Taggarttest',
      password: 'john95taggarttest',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('john1995test');
      cy.get('#password').type('john95taggarttest');
      cy.get('#login-button').click();

      cy.contains('John Taggarttest logged-in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('john1995test');
      cy.get('#password').type('wrong_pass');
      cy.get('#login-button').click();

      cy.contains('Wrong credentials');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('john1995test');
      cy.get('#password').type('john95taggarttest');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type('This is blog title');
      cy.get('#author').type('This is blog author');
      cy.get('#url').type('htpps://thisistheblogsite.com');
      cy.get('#create-button').click();
      // cy.reload(true);
      cy.contains('This is blog title');
      cy.contains('This is blog author');
      cy.reload(true);
      cy.contains('htpps://thisistheblogsite.com');
    });
  });

  describe('When logged in and created a blog', function () {
    beforeEach(function () {
      cy.get('#username').type('john1995test');
      cy.get('#password').type('john95taggarttest');
      cy.get('#login-button').click();
    });

    it('A blog can be liked and deleted', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type('This is blog title');
      cy.get('#author').type('This is blog author');
      cy.get('#url').type('htpps://thisistheblogsite.com');
      cy.get('#create-button').click();
      // cy.reload(true);
      cy.contains('This is blog title');
      cy.contains('This is blog author');
      cy.reload(true);
      cy.contains('htpps://thisistheblogsite.com');

      // start here
      cy.contains('show').click();
      cy.get('#like-button').click();
      cy.reload(true);

      // remove blog here
      cy.contains('show').click();
      cy.contains('remove').click();
      cy.reload(true);
    });
  });

  describe('When logged in and created a blog', function () {
    beforeEach(function () {
      cy.get('#username').type('john1995test');
      cy.get('#password').type('john95taggarttest');
      cy.get('#login-button').click();
    });

    it('The blogs shorted by likes', function () {
      // cy.contains('create new blog').click();
      // cy.get('#title').type('This is blog title');
      // cy.get('#author').type('This is blog author');
      // cy.get('#url').type('htpps://thisistheblogsite.com');
      // cy.get('#create-button').click();
      // // cy.reload(true);
      // cy.contains('This is blog title');
      // cy.contains('This is blog author');
      // cy.reload(true);
      // cy.contains('htpps://thisistheblogsite.com');
      // cy.contains('create new blog').click();
      // cy.get('#title').type('This is blog title');
      // cy.get('#author').type('This is blog author');
      // cy.get('#url').type('htpps://thisistheblogsite.com');
      // cy.get('#create-button').click();
      // // cy.reload(true);
      // cy.contains('This is blog title');
      // cy.contains('This is blog author');
      // cy.reload(true);
      // cy.contains('htpps://thisistheblogsite.com');
      // // start here
      // cy.contains('show').click();
      // cy.get('#like-button').click();
      // cy.reload(true);
      // // remove blog here
      // cy.contains('show').click();
      // cy.contains('remove').click();
      // cy.reload(true);
    });
  });
});
