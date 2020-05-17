const memoContract={
  user: {
    indices: [
      {
        unique: true,
        properties: [
          {
            userName: 'asc'
          }
        ]
      }
    ],
    required: [
      'userName'
    ],
    properties: {
      userName: {
        type: 'string'
      }
    },
    additionalProperties: false
  },
  profile: {
    indices: [
      {
        unique: true,
        properties: [
          {
            userName: 'asc'
          }
        ]
      }
    ],
    required: [
      'userName',
      'displayName'
    ],
    properties: {
      userName: {
        type: 'string'
      },
      displayName: {
        type: 'string'
      },
      about: {
        type: 'string'
      },
      avatarUrl: {
        type: 'string',
        format: 'url'
      }
    },
    additionalProperties: false
  },
  message: {
    indices: [
      {
        unique: true,
        properties: [
          {
            userName: 'asc'
          },
          {
            msgDate: 'asc'
          }
        ]
      }
    ],
    required: [
      'userName',
      'msgDate',
      'msgId',
      'msgBody'
    ],
    properties: {
      userName: {
        type: 'string'
      },
      msgDate: {
        type: 'datetime'
      },
      msgId: {
        type: 'number'
      },
      msgBody: {
        type: 'string'
      }
    },
    additionalProperties: false
  },
  like: {
    indices: [
      {
        unique: true,
        properties: [
          {
            userName: 'asc'
          },
          {
            msgId: 'asc'
          }
        ]
      }
    ],
    required: [
      'userName',
      'msgId'
    ],
    properties: {
      userName: {
        type: 'string'
      },
      msgId: {
        type: 'number'
      }
    },
    additionalProperties: false
  },
  follow: {
    indices: [
      {
        unique: true,
        properties: [
          {
            userNameFollower: 'asc'
          },
          {
            userNameFollowed: 'asc'
          }
        ]
      }
    ],
    required: [
      'userNameFollower',
      'userNameFollowed'
    ],
    properties: {
      userNameFollower: {
        type: 'string'
      },
      userNameFollowed: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
};

module.exports.memoContract=memoContract;