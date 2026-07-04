export type ChannelType = 'TEXT' | 'VOICE'

export type Channel = {
  id: string
  serverId: string
  name: string
  type: ChannelType
}
