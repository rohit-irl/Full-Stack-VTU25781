package com.example.productapi.controller;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

import com.example.productapi.model.Product;

@RestController
@RequestMapping("/products")
public class ProductController {

    List<Product> products = new ArrayList<>();

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        products.add(product);
        return product;
    }

    @GetMapping
    public List<Product> getProducts() {
        return products;
    }

    // GET product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable int id) {
        for (Product p : products) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    // UPDATE product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable int id, @RequestBody Product updatedProduct) {
        for (Product p : products) {
            if (p.getId() == id) {
                p.setName(updatedProduct.getName());
                p.setPrice(updatedProduct.getPrice());
                return p;
            }
        }
        return null;
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable int id) {
        for (Product p : products) {
            if (p.getId() == id) {
                products.remove(p);
                return "Product deleted";
            }
        }
        return "Product not found";
    }
}