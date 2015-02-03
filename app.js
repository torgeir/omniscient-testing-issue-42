// require('6to5/polyfill');
import React from 'react';
import {DOM} from 'react/addons';
let {div, span, ul, li} = DOM;

import immstruct from 'immstruct';
import component from 'omniscient';
component.debug();

let quiz = immstruct({
  answers: [],
  clock: new Date()
});

let Answers = component(({ answers }) =>
  div({},
    [ul({},
      answers.map((answer, i) =>
        li({ key: i },
          answer)).toArray()),
     Clock()]));

let Clock = component('Clock', [ forceUpdateOn('clock', quiz) ], () =>
  div({},
    String(quiz.cursor('clock').deref())));

function forceUpdateOn (path, structure) {
  return {
    // this needs to not unconditionally replace componentWillMount
    componentWillMount: function () {
      structure.on('change', changedPath => {
        if (changedPath[0] == path) {
          this.forceUpdate();
        }
      });
    }
  };
}

setInterval(() => quiz.cursor('answers').update(a => a.push('Answer ' + a.count())), 3000);
setInterval(() => quiz.cursor().set('clock', new Date()), 1000);

render();
quiz.on('swap', render);

function render () {
  React.render(Answers({ answers: quiz.cursor('answers') }), document.body);
}
