// Proper namespacing
window.App = {
  Models: {},
  Collections: {},
  Views: {},
  currentView: null
};

$(document).ready(function() {

  App.Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'notes': 'notes'
    },

    index: function() {
      console.log('INDEX!');
      
      this.removeView();
      App.currentView = new App.Views.Index();
    },

    notes: function() {
      console.log('NOTES!');

      this.removeView();
      App.currentView = new App.Views.Notes();
    },

    removeView: function() {
      if (App.currentView)
        App.currentView.destroy();
    }
  });

  App.Models.Note = Backbone.Model.extend({
    defaults: {
      author: 'James',
      date: Date().toString(),
      title: 'Untitled',
      body: '...'
    }
  });

  App.Views.Note = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#note-template').html()),

    events: {
      'click .delete-note': 'deleteNote'
    },

    render: function() {
      // Render template and set as current el
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    deleteNote: function() {
      // Destroy the note's model and remove its view
      this.model.destroy();
      this.remove();
    }
  });

  App.Collections.Notes = Backbone.Collection.extend({
    model: App.Models.Note,
    localStorage: new Store('backbone-notes')
  });

  App.Views.Notes = Backbone.View.extend({
    id: '#notes',
    template: _.template($('#notes-template').html(), {}),
    
    initialize: function() {
      this.render();

      // Fetch all notes from LocalStorage
      notes.fetch();

      // Render each note
      notes.each(function(note) {
        console.log(note);
        this.renderNote(note);
      }, this);
    },

    render: function() {
      // Insert template into DOM
      $('#view').html(this.template());

      // Set el to notes-list
      this.setElement('#notes-list');

      console.log(this.el);
    },

    renderNote: function(note) {
      var view = new App.Views.Note({model: note});
      this.$el.append(view.render().el);
    },

    destroy: function() {
      $(this.id).remove();
      this.remove();
    }
  });

  App.Views.Index = Backbone.View.extend({
    id: '#index',
    template: _.template($('#index-template').html(), {}),

    initialize: function() {
      this.render();
      
      // Instance variables for the inputs
      this.title = this.$('#title');
      this.author = this.$('#author');
      this.body = this.$('#body');
    },

    render: function() {
      // Setup el from template
      this.setElement(this.template());

      // Insert el into DOM
      $('#view').html(this.el);
    },

    events: {
      // Create a new note on button click
      'click .submit': 'createNote'
    },

    createNote: function() {
      notes.create(this.getInputs());
    },

    getInputs: function() {
      return {
        title: this.title.val().trim(),
        author: this.author.val().trim(),
        body: this.body.val().trim()
      };
    },

    destroy: function() {
      // Clear the view's HTML
      this.$el.remove();

      // Remove view the Backbone way
      this.remove();
    }
  });

  var Router = new App.Router();
  var notes = new App.Collections.Notes();

  Backbone.history.start();
});
