import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let counter = 0

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    connection: null,
    figures: [],
    canvasInit: {
      width: 0,
      height: 0,
      base64: ''
    }
  },

  mutations: {
    setConnection (state, connection) {
      state.connection = connection

      connection.on('canvasInit', data => store.commit('setCanvasInit', data))
      connection.on('addFigure', figure => store.commit('addFigure', figure))
    },

    setCanvasInit (state, data) {
      state.canvasInit = {
        ...state.canvasInit,
        ...data
      }
    },

    addFigure (state, figure) {
      state.figures = [...state.figures, { id: ++counter, ...figure }]
    },

    removeFigures (state, ids) {
      state.figures = state.figures.filter(figure => !ids.includes(figure.id))
    }
  },

  actions: {
    addLine ({ state: { connection } }, payload) {
      connection.send({
        type: 'addFigure',
        data: {
          type: 'line',
          ...payload
        }
      })
    },

    addCircle ({ state: { connection } }, payload) {
      connection.send({
        type: 'addFigure',
        data: {
          type: 'circle',
          ...payload
        }
      })
    }
  }
})

export default store
