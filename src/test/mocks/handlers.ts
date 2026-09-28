import { http, HttpResponse } from "msw";

export const API_BASE = "https://administators.bps1310.cloud/api";

export const mockKategoriData = [
  {
    id_kategori: 1,
    nama_kategori: "Katalog Layanan",
    deskripsi: "Layanan statistik terpadu Solok Selatan",
  },
  {
    id_kategori: 2,
    nama_kategori: "Website Resmi",
    deskripsi: "Portal dan website resmi BPS",
  },
];

export const mockLayananData = [
  {
    id_layanan: 101,
    id_kategori: 1,
    nama_layanan: "Pelayanan Statistik Terpadu (PST)",
    url: "https://pst.bps.go.id",
    logo: "",
    nama_kategori: "Katalog Layanan",
  },
  {
    id_layanan: 102,
    id_kategori: 2,
    nama_layanan: "Website BPS Solsel",
    url: "https://solokselatankab.bps.go.id",
    logo: "",
    nama_kategori: "Website Resmi",
  },
];

export const mockWebsiteData = [
  {
    title: "Publikasi dan Data",
    category: "Distribusi",
    description: "Website publikasi dan data distribusi BPS",
    links: [
      {
        id_layanan: 201,
        label: "Ekspor Impor Solsel",
        href: "https://example.com/ekspor-impor",
        logo: "",
      },
    ],
  },
];

export const handlers = [
  http.get(`${API_BASE}/kategori.php`, () => {
    return HttpResponse.json({
      status: true,
      message: "Success",
      data: mockKategoriData,
    });
  }),

  http.get(`${API_BASE}/layanan.php`, () => {
    return HttpResponse.json({
      status: true,
      message: "Success",
      data: mockLayananData,
    });
  }),

  http.get(`${API_BASE}/website.php`, () => {
    return HttpResponse.json({
      status: true,
      message: "Success",
      data: mockWebsiteData,
    });
  }),
];
