import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { fetchNews, NewsData } from './src/utils/handle-api';
import News from './src/components/News';
import NewsDetail from './src/components/NewsDetail';
import { globalStyles } from './src/styles/global';

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);

  const filteredList = useMemo(() => {
    let result = newsList;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(lower));
    }
    return [...result].sort((a, b) => {
      const dateA = new Date(a.published).getTime();
      const dateB = new Date(b.published).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [newsList, searchQuery, sortOrder]);

  useEffect(() => {
    fetchNews()
      .then((data) => {
        setNewsList(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Falha ao carregar notícias.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ fontSize: globalStyles.bodyFontSize }}>Carregando notícias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📰 News App</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notícias..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'asc' && styles.sortButtonActive]}
          onPress={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          <Text style={styles.sortButtonText}>
            {sortOrder === 'desc' ? '↓ Mais recentes' : '↑ Mais antigas'}
          </Text>
        </TouchableOpacity>
      </View>

      {!loading && !error && (
        <Text style={styles.counter}>{filteredList.length} notícias encontradas</Text>
      )}

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <News
            news={item}
            onPress={(news) => setSelectedNews(news)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Nenhuma notícia disponível no momento.</Text>
          </View>
        }
      />
      <Modal
        visible={selectedNews !== null}
        animationType="slide"
        onRequestClose={() => setSelectedNews(null)}
      >
        <NewsDetail news={selectedNews} onClose={() => setSelectedNews(null)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  counter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  searchInput: {
    marginTop: 10,
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  sortButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  sortButtonActive: {
    backgroundColor: globalStyles.primaryColor,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#1a1a2e',
    fontWeight: '600',
  },
});
