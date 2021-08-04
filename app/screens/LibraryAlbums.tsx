import CoverArt from '@app/components/CoverArt'
import GradientFlatList from '@app/components/GradientFlatList'
import PressableOpacity from '@app/components/PressableOpacity'
import { useActiveListRefresh2 } from '@app/hooks/server'
import { Album } from '@app/models/music'
import { selectMusic } from '@app/state/music'
import { useStore } from '@app/state/store'
import colors from '@app/styles/colors'
import font from '@app/styles/font'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import FastImage from 'react-native-fast-image'

const AlbumItem = React.memo<{
  id: string
  name: string
  size: number
  height: number
  artist?: string
  coverArt?: string
}>(({ id, name, artist, size, height, coverArt }) => {
  const navigation = useNavigation()

  return (
    <PressableOpacity
      style={[styles.item, { maxWidth: size, height }]}
      onPress={() => navigation.navigate('album', { id, title: name })}>
      <CoverArt coverArt={coverArt} style={{ height: size, width: size }} resizeMode={FastImage.resizeMode.cover} />
      <View style={styles.itemDetails}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {artist}
        </Text>
      </View>
    </PressableOpacity>
  )
})

const AlbumListRenderItem: React.FC<{
  item: { album: Album; size: number; height: number }
}> = ({ item }) => (
  <AlbumItem
    id={item.album.id}
    coverArt={item.album.coverArt}
    name={item.album.name}
    artist={item.album.artist}
    size={item.size}
    height={item.height}
  />
)

const AlbumsList = () => {
  const list = useStore(selectMusic.albums)
  const updating = useStore(selectMusic.albumsUpdating)
  const updateList = useStore(selectMusic.fetchAlbums)

  useActiveListRefresh2(updateList)

  const layout = useWindowDimensions()

  const size = layout.width / 3 - styles.item.marginHorizontal * 2
  const height = size + 36

  const albumsList = list.map(album => ({ album, size, height }))

  return (
    <View style={styles.container}>
      <GradientFlatList
        contentContainerStyle={styles.listContent}
        data={albumsList}
        renderItem={AlbumListRenderItem}
        keyExtractor={item => item.album.id}
        numColumns={3}
        removeClippedSubviews={true}
        refreshing={updating}
        onRefresh={updateList}
        overScrollMode="never"
        getItemLayout={(_data, index) => ({
          length: height,
          offset: height * Math.floor(index / 3),
          index,
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  listContent: {
    minHeight: '100%',
  },
  container: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 3,
    flex: 1 / 3,
  },
  itemDetails: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontFamily: font.semiBold,
    color: colors.text.primary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.text.secondary,
  },
})

export default React.memo(AlbumsList)
